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
}: GameOverMenuProps) {
    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Content - Centered Vertically */}
            <div className="relative z-10 flex flex-col items-center justify-center px-6 w-full max-w-[320px]">

                {/* Game Over Title - Large & Centered */}
                <h1 className="text-5xl font-extrabold font-mono text-red-500 text-center mb-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-fade-in-up tracking-wider">
                    GAME OVER
                </h1>

                {/* Score Display - Centered Below Title */}
                <div className="text-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest mb-2">Your Score</p>
                    <p className="text-7xl font-extrabold font-mono text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-score-pop">
                        {score}
                    </p>

                    {/* Best Score */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <span className="text-blue-400/70 font-mono text-xs uppercase tracking-wide">Best:</span>
                        <span className="text-cyan-300 font-mono text-lg font-bold">{highScore}</span>
                    </div>

                    {/* New Record Badge */}
                    {isNewRecord && (
                        <div className="mt-4">
                            <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold font-mono text-sm px-5 py-2 rounded-full animate-pulse shadow-[0_0_20px_rgba(234,179,8,0.7)]">
                                🎉 NEW RECORD! 🎉
                            </span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4 w-full max-w-[200px] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                    {/* Play Again Button - Primary, Round */}
                    <button
                        onClick={onPlayAgain}
                        className="menu-btn menu-btn-primary w-full py-4 text-lg rounded-xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,212,255,0.5)] hover:shadow-[0_0_35px_rgba(0,212,255,0.7)] transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="text-2xl">▶</span>
                        <span>PLAY AGAIN</span>
                    </button>

                    {/* Back to Menu */}
                    <button
                        onClick={onMainMenu}
                        className="text-cyan-500/60 hover:text-cyan-400 font-mono text-sm transition-colors tracking-wide uppercase py-2"
                    >
                        ← Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
