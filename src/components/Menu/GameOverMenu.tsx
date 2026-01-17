"use client";

import React from 'react';

interface GameOverMenuProps {
    score: number;
    highScore: number;
    isNewRecord: boolean;
    onPlayAgain: () => void;
    onMainMenu: () => void;
    onShare: () => void;
    onOpenShop: () => void;
    onOpenLeaderboard: () => void;
}

export default function GameOverMenu({
    score,
    highScore,
    isNewRecord,
    onPlayAgain,
    onMainMenu,
    onShare,
    onOpenShop,
    onOpenLeaderboard
}: GameOverMenuProps) {
    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center px-6 max-w-[320px] w-full">

                {/* Game Over Title */}
                <h2 className="text-5xl font-bold font-mono text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-fade-in-up tracking-widest">
                    GAME OVER
                </h2>

                {/* Score Panel */}
                <div className="bg-[#1E293B]/90 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 mb-6 w-full shadow-[0_0_20px_rgba(0,212,255,0.15)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

                    {/* Current Score */}
                    <div className="text-center mb-4">
                        <p className="text-blue-300 font-mono text-xs uppercase tracking-widest mb-1">Score</p>
                        <p className="text-6xl font-bold font-mono text-white animate-score-pop drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            {score}
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-4" />

                    {/* High Score */}
                    <div className="text-center">
                        <p className="text-blue-300 font-mono text-xs uppercase tracking-widest mb-1">Best</p>
                        <p className="text-3xl font-bold font-mono text-cyan-400">
                            {highScore}
                        </p>
                    </div>

                    {/* New Record Badge */}
                    {isNewRecord && (
                        <div className="mt-4 text-center">
                            <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold font-mono text-xs px-4 py-1 rounded-full animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.6)]">
                                🎉 NEW RECORD! 🎉
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                    {/* Play Again - Primary */}
                    <button
                        onClick={onPlayAgain}
                        className="menu-btn menu-btn-primary w-full"
                    >
                        ▶ PLAY AGAIN
                    </button>

                    {/* Secondary Actions Row */}
                    <div className="flex gap-2">
                        <button
                            onClick={onShare}
                            className="menu-btn menu-btn-blue flex-1 text-sm py-3 px-3"
                        >
                            📤 SHARE
                        </button>
                        <button
                            onClick={onOpenShop}
                            className="menu-btn menu-btn-secondary flex-1 text-sm py-3 px-3"
                        >
                            🛒 SHOP
                        </button>
                    </div>

                    {/* Leaderboard */}
                    <button
                        onClick={onOpenLeaderboard}
                        className="menu-btn menu-btn-purple w-full text-sm py-3"
                    >
                        🏆 LEADERBOARD
                    </button>

                    {/* Back to Menu */}
                    <button
                        onClick={onMainMenu}
                        className="text-cyan-500/70 hover:text-cyan-400 font-mono text-sm mt-3 transition-colors tracking-wide uppercase"
                    >
                        ← Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
