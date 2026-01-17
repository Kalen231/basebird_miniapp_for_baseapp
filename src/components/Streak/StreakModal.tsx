"use client";

import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { DAILY_STREAK_ADDRESS, DAILY_STREAK_ABI } from '@/config/contracts';

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

    const [currentTime, setCurrentTime] = useState<number>(Math.floor(Date.now() / 1000));

    // Update timer every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const { data: streakStatus, refetch } = useReadContract({
        address: DAILY_STREAK_ADDRESS as `0x${string}`,
        abi: DAILY_STREAK_ABI,
        functionName: 'getStreakStatus',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && isOpen,
        }
    });

    useEffect(() => {
        if (isOpen) refetch();
    }, [isOpen, refetch, isConfirmed]);

    // --- LOGIC START ---

    // 1. Raw Data from Blockchain
    const rawStreak = streakStatus ? Number(streakStatus[0]) : 0;
    const lastMint = streakStatus ? Number(streakStatus[1]) : 0;
    const hasAchievement = streakStatus ? streakStatus[2] : false; // Early Bird Badge

    // 2. Constants
    const SECONDS_IN_DAY = 86400; // 24h
    const SECONDS_FOR_BREAK = 172800; // 48h

    // 3. Derived Local State
    const timeSinceLastMint = currentTime - lastMint;

    // A streak is broken if more than 48 hours passed since last mint.
    // Exception: If lastMint is 0, user never played, so not broken, just 0.
    const isStreakBroken = lastMint > 0 && timeSinceLastMint > SECONDS_FOR_BREAK;

    // 4. Effective Streak (What we show to user)
    // If broken, visually we are at 0.
    const effectiveStreak = isStreakBroken ? 0 : rawStreak;

    // 5. Next Day Target
    // If effective is 2, we are working towards Day 3.
    const targetDay = effectiveStreak + 1;

    // 6. Cooldown Status
    // Cooldown is active if less than 24h passed.
    // BUT! If streak is broken (>48h), there is NO cooldown, user can restart immediately.
    const isCooldown = lastMint > 0 && timeSinceLastMint < SECONDS_IN_DAY && !isStreakBroken;
    const timeLeft = SECONDS_IN_DAY - timeSinceLastMint;

    // 7. Can Mint?
    // We can mint if we are connected AND not in cooldown.
    const canMint = isConnected && !isCooldown;

    // --- LOGIC END ---

    const handleMint = () => {
        if (!address) return;
        writeContract({
            address: DAILY_STREAK_ADDRESS as `0x${string}`,
            abi: DAILY_STREAK_ABI,
            functionName: 'mintDaily',
        });
    };

    const formatTime = (seconds: number) => {
        if (seconds < 0) return "00:00:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn">
            <div className="relative w-full max-w-md bg-[#1a0b2e] border-2 border-purple-500/30 rounded-3xl p-6 shadow-[0_0_60px_rgba(124,58,237,0.2)] flex flex-col items-center">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/20 transition-colors"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="text-center mb-8 mt-2">
                    <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 tracking-wider drop-shadow-sm">
                        DAILY STREAK
                    </h2>
                    <p className="text-gray-400 text-sm mt-1 font-mono">
                        Login daily to earn Energy
                    </p>
                </div>

                {/* Main Streak Counter */}
                <div className="flex flex-col items-center mb-8">
                    <div className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        {effectiveStreak}
                    </div>
                    <div className="text-sm font-bold text-gray-500 tracking-[0.3em] uppercase mt-1">
                        Current Streak
                    </div>
                </div>

                {/* Days Grid */}
                <div className="flex justify-between w-full mb-8 px-2 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                        const isCompleted = day <= effectiveStreak;
                        // const isNext = day === targetDay;

                        // Special styling for Day 7
                        if (day === 7) {
                            return (
                                <div key={day} className="relative flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${isCompleted
                                            ? 'bg-yellow-500 border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                                            : 'bg-gray-800 border-gray-700'
                                        }`}>
                                        <span className="text-xl">🏆</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono">Day 7</span>
                                </div>
                            )
                        }

                        return (
                            <div key={day} className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted
                                        ? 'bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                                        : 'bg-gray-800/50 border-gray-700 text-gray-600'
                                    }`}>
                                    {isCompleted ? (
                                        <span className="font-bold text-white">✓</span>
                                    ) : (
                                        <span className="font-mono text-xs">{day}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Achievement Badge (If Owned) */}
                {hasAchievement && (
                    <div className="w-full bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl p-3 mb-6 flex items-center gap-3">
                        <span className="text-2xl">🏅</span>
                        <div>
                            <p className="text-yellow-200 font-bold text-sm">Early Bird Unlocked</p>
                            <p className="text-yellow-500/50 text-[10px]">Permanent achievement earned</p>
                        </div>
                    </div>
                )}

                {/* ACTION AREA */}
                <div className="w-full">
                    {/* Status: BROKEN STREAK */}
                    {isStreakBroken && (
                        <div className="text-center mb-4 p-3 bg-red-900/20 rounded-xl border border-red-500/30">
                            <p className="text-red-400 font-bold text-sm">Oh no! Streak Lost 💔</p>
                            <p className="text-red-300/70 text-xs">You missed a day. Start over!</p>
                        </div>
                    )}

                    {/* Status: COOLDOWN */}
                    {canMint ? (
                        <button
                            disabled={isPending || isConfirming}
                            onClick={handleMint}
                            className={`
                                w-full py-4 rounded-xl font-black font-mono text-lg tracking-wider shadow-lg transition-all
                                flex items-center justify-center gap-3
                                ${isPending || isConfirming
                                    ? 'bg-gray-700 text-gray-400 cursor-wait'
                                    : 'bg-gradient-to-r from-orange-500 to-red-600 hover:scale-[1.02] hover:shadow-orange-500/20 text-white'
                                }
                            `}
                        >
                            {isPending || isConfirming ? 'PROCESSING...' : `MINT DAY ${targetDay}`}
                        </button>
                    ) : (
                        // If not canMint, usually means Cooldown (if connected)
                        isCooldown ? (
                            <div className="w-full py-4 bg-gray-800 rounded-xl border border-gray-700 text-center">
                                <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Refills In</p>
                                <p className="text-2xl font-mono font-bold text-white tabular-nums">{formatTime(timeLeft)}</p>
                            </div>
                        ) : (
                            !isConnected && (
                                <div className="text-center text-gray-500 text-sm">Please connect wallet</div>
                            )
                        )
                    )}
                </div>

                {writeError && (
                    <p className="mt-4 text-[10px] text-red-500 text-center opacity-70">
                        {writeError.message.split('.')[0]}
                    </p>
                )}
            </div>
        </div>
    );
}
