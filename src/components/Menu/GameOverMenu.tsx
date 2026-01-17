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
                <h2 className="text-4xl font-bold font-mono text-red-500 mb-6 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] animate-fade-in-up">
                    GAME OVER
                </h2>

                {/* Score Panel */}
                <div className="bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-600 rounded-xl p-6 mb-6 w-full shadow-[0_8px_0_0_#92400e] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

                    {/* Current Score */}
                    <div className="text-center mb-4">
                        <p className="text-amber-700 font-mono text-sm uppercase tracking-wider">Score</p>
                        <p className="text-5xl font-bold font-mono text-amber-900 animate-score-pop">
                            {score}
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-amber-400 my-3" />

                    {/* High Score */}
                    <div className="text-center">
                        <p className="text-amber-700 font-mono text-sm uppercase tracking-wider">Best</p>
                        <p className="text-3xl font-bold font-mono text-amber-800">
                            {highScore}
                        </p>
                    </div>

                    {/* New Record Badge */}
                    {isNewRecord && (
                        <div className="mt-4 text-center">
                            <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold font-mono text-sm px-4 py-1 rounded-full animate-pulse shadow-lg">
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
                        className="text-gray-400 hover:text-white font-mono text-sm mt-2 transition-colors"
                    >
                        ← Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
