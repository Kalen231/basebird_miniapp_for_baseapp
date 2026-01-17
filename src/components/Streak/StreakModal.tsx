"use client";

import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DAILY_STREAK_ADDRESS, DAILY_STREAK_ABI } from '@/config/contracts';
import { useFarcasterContext } from '@/components/Providers';

interface StreakModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StreakModal({
    isOpen,
    onClose
}: StreakModalProps) {
    const { address, isConnected } = useAccount();
    const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const { data: streakStatus, refetch } = useReadContract({
        address: DAILY_STREAK_ADDRESS as `0x${string}`,
        abi: DAILY_STREAK_ABI,
        functionName: 'getStreakStatus',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && isOpen,
        }
    });

    // Parse status
    // Returns: [currentStreak, lastMint, isCompleted, canMint]
    const currentStreak = streakStatus ? Number(streakStatus[0]) : 0;
    const lastMint = streakStatus ? Number(streakStatus[1]) : 0;
    const isCompleted = streakStatus ? streakStatus[2] : false;
    const canMint = streakStatus ? streakStatus[3] : false;

    // Refresh on open or confirm
    useEffect(() => {
        if (isOpen) refetch();
    }, [isOpen, refetch, isConfirmed]);

    const handleMint = () => {
        if (!address) return;
        writeContract({
            address: DAILY_STREAK_ADDRESS as `0x${string}`,
            abi: DAILY_STREAK_ABI,
            functionName: 'mintDaily',
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-[#1a0b2e] border-4 border-orange-500 rounded-xl p-6 shadow-[0_0_50px_rgba(249,115,22,0.3)] flex flex-col items-center">

                {/* Header */}
                <div className="w-full flex justify-between items-center mb-6 border-b-2 border-orange-500/30 pb-4">
                    <h2 className="text-2xl font-bold font-mono text-orange-400 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                        🔥 DAILY STREAK
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-orange-300 hover:text-white font-mono text-xl font-bold transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Progress Grid */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                        const isUnlocked = day <= currentStreak;
                        // const isNext = day === currentStreak + 1; // Not really "next" logic for visual if we show history

                        return (
                            <div
                                key={day}
                                className={`
                                    relative w-16 h-16 rounded-lg border-2 flex items-center justify-center
                                    ${day === 7 ? 'col-span-4 w-full h-20 mt-2 mx-auto' : ''}
                                    ${isUnlocked
                                        ? 'bg-orange-500 border-yellow-300 shadow-[0_0_15px_rgba(249,115,22,0.6)]'
                                        : 'bg-gray-800/50 border-gray-600 opacity-50'
                                    }
                                `}
                            >
                                {day === 7 ? (
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">🏆</span>
                                        <div className="text-left">
                                            <div className="font-bold text-white text-sm">DAY 7</div>
                                            <div className="text-xs text-yellow-200">EARLY BIRD ACHIEVEMENT</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="font-mono text-xl font-bold text-white">
                                        {isUnlocked ? '✓' : day}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Status Message */}
                <div className="mb-6 text-center">
                    {isCompleted ? (
                        <p className="text-green-400 font-bold">🎉 STREAK COMPLETED! EARLY BIRD UNLOCKED! 🎉</p>
                    ) : (
                        <p className="text-orange-200 text-sm font-mono">
                            Mint daily energy to keep your streak alive.<br />
                            Miss a day = Streak Reset!
                        </p>
                    )}
                </div>

                {/* Action Button */}
                {!isCompleted && (
                    <button
                        disabled={!canMint || isPending || isConfirming || !isConnected}
                        onClick={handleMint}
                        className={`
                            w-full py-4 rounded-xl font-black text-xl font-mono tracking-wider transition-all
                            ${canMint
                                ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-pulse'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {isPending || isConfirming ? '⏳ MINTING...' :
                            !canMint ? (currentStreak > 0 ? '🕒 COME BACK TOMORROW' : '🕒 WAIT FOR COOLDOWN') :
                                '⚡ MINT ENERGY'}
                    </button>
                )}

                {/* Connection Warning */}
                {!isConnected && (
                    <p className="mt-4 text-red-400 text-xs text-center border border-red-500/50 p-2 rounded">
                        Wait for wallet connection...
                    </p>
                )}

                {/* Mock/Error Warning (Visually hidden if working, helps debugging) */}

                {writeError && (
                    <p className="mt-4 text-xs text-red-500 text-center font-mono bg-black/50 p-2 rounded break-all">
                        Error: {writeError.message.slice(0, 100)}...
                    </p>
                )}
            </div>
        </div>
    );
}
