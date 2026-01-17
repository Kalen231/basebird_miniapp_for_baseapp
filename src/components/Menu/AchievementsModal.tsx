"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useSendTransaction } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { parseEther } from 'viem';
import { useMutation } from '@tanstack/react-query';
import { useFarcasterContext } from '@/components/Providers';
import { config } from '@/config/wagmi';
import { ACHIEVEMENTS, Achievement } from '@/config/achievements';

interface UserAchievement {
    id: string;
    fid: number;
    achievement_id: string;
    unlocked_at: string;
    minted: boolean;
    mint_tx_hash: string | null;
}

interface AchievementsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userAchievements: UserAchievement[];
    onMintSuccess: (achievementId: string) => void;
}

export default function AchievementsModal({
    isOpen,
    onClose,
    userAchievements,
    onMintSuccess
}: AchievementsModalProps) {
    const { sendTransactionAsync } = useSendTransaction();
    const { fid } = useFarcasterContext();
    const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;

    const [mintingId, setMintingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const mintMutation = useMutation({
        mutationKey: ['mintAchievement'],
        mutationFn: async ({ achievementId }: { achievementId: string }) => {
            if (!fid) throw new Error("User not logged in");
            if (!adminWallet) throw new Error("Admin wallet not configured");

            setMintingId(achievementId);
            setError(null);

            // Send minimal transaction (gas only)
            const hash = await sendTransactionAsync({
                to: adminWallet as `0x${string}`,
                value: parseEther('0'), // Only gas cost
            });

            // Wait for confirmation
            await waitForTransactionReceipt(config, { hash });

            // Verify on backend
            const response = await fetch('/api/achievements/mint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fid,
                    achievementId,
                    txHash: hash
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Mint failed');
            }

            return { hash, achievementId };
        },
        onSuccess: (data) => {
            onMintSuccess(data.achievementId);
            setMintingId(null);
        },
        onError: (err) => {
            setError(err.message);
            setMintingId(null);
        }
    });

    if (!isOpen) return null;

    const getAchievementStatus = (achievement: Achievement): 'locked' | 'unlocked' | 'minted' => {
        const userAch = userAchievements.find(ua => ua.achievement_id === achievement.id);
        if (!userAch) return 'locked';
        if (userAch.minted) return 'minted';
        return 'unlocked';
    };

    const handleMint = (achievement: Achievement) => {
        mintMutation.mutate({ achievementId: achievement.id });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg bg-zinc-800 border-4 border-gray-400 p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] max-h-[80vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b-2 border-gray-600 pb-2">
                    <h2 className="text-2xl font-bold font-mono text-yellow-400">🏅 ACHIEVEMENTS</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white font-mono text-xl font-bold"
                    >
                        [X]
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-2 bg-red-900/50 border border-red-500 text-red-300 text-xs font-mono">
                        ❌ {error}
                    </div>
                )}

                {/* Achievements List */}
                <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                    {ACHIEVEMENTS.map((achievement) => {
                        const status = getAchievementStatus(achievement);
                        const isMinting = mintingId === achievement.id;

                        return (
                            <div
                                key={achievement.id}
                                className={`flex items-center justify-between p-3 bg-zinc-900 border-2 transition-all ${status === 'minted' ? 'border-yellow-500' :
                                        status === 'unlocked' ? 'border-green-500' :
                                            'border-gray-700 opacity-60'
                                    }`}
                            >
                                {/* Left: Icon + Info */}
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 flex items-center justify-center text-3xl rounded ${status === 'locked' ? 'grayscale' : ''
                                        }`}>
                                        {status === 'locked' ? '🔒' : achievement.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold font-mono text-sm ${status === 'locked' ? 'text-gray-500' : 'text-white'
                                            }`}>
                                            {achievement.name}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 font-mono leading-tight">
                                            {achievement.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Status/Action */}
                                <div className="text-right flex flex-col items-end min-w-[80px]">
                                    {status === 'minted' ? (
                                        <span className="text-yellow-400 font-bold font-mono text-xs flex items-center gap-1">
                                            💎 MINTED
                                        </span>
                                    ) : status === 'unlocked' ? (
                                        <button
                                            onClick={() => handleMint(achievement)}
                                            disabled={isMinting || mintMutation.isPending}
                                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white font-bold font-mono text-xs border-2 border-green-400 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isMinting ? 'MINTING...' : 'MINT'}
                                        </button>
                                    ) : (
                                        <span className="text-gray-500 font-mono text-xs">
                                            LOCKED
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Info */}
                <div className="mt-4 pt-3 border-t border-gray-600">
                    <p className="text-[10px] text-gray-500 font-mono text-center">
                        🎮 Complete challenges to unlock • 💎 Mint achievements on Base (gas only)
                    </p>
                </div>

            </div>
        </div>
    );
}
