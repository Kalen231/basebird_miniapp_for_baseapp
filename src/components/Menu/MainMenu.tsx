"use client";

import React from 'react';

interface MainMenuProps {
    onPlay: () => void;
    onOpenShop: () => void;
    onOpenInventory: () => void;
    onOpenLeaderboard: () => void;
    onOpenAchievements: () => void;
    playerName?: string;
    highScore?: number;
}

export default function MainMenu({
    onPlay,
    onOpenShop,
    onOpenInventory,
    onOpenLeaderboard,
    onOpenAchievements,
    playerName,
    highScore = 0
}: MainMenuProps) {
    return (
        <div className="relative w-full max-w-[430px] mx-auto h-[600px] overflow-hidden border-4 border-black">
            {/* Sky Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500" />

            {/* Animated Clouds */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="cloud cloud-1 absolute top-[10%] opacity-80">
                    <svg width="100" height="50" viewBox="0 0 100 50">
                        <ellipse cx="50" cy="35" rx="40" ry="15" fill="white" />
                        <ellipse cx="30" cy="30" rx="25" ry="20" fill="white" />
                        <ellipse cx="60" cy="25" rx="30" ry="20" fill="white" />
                    </svg>
                </div>
                <div className="cloud cloud-2 absolute top-[25%] opacity-70">
                    <svg width="80" height="40" viewBox="0 0 80 40">
                        <ellipse cx="40" cy="25" rx="30" ry="12" fill="white" />
                        <ellipse cx="25" cy="22" rx="20" ry="15" fill="white" />
                        <ellipse cx="50" cy="18" rx="22" ry="15" fill="white" />
                    </svg>
                </div>
                <div className="cloud cloud-3 absolute top-[45%] opacity-60">
                    <svg width="120" height="60" viewBox="0 0 120 60">
                        <ellipse cx="60" cy="40" rx="50" ry="18" fill="white" />
                        <ellipse cx="35" cy="35" rx="30" ry="22" fill="white" />
                        <ellipse cx="75" cy="30" rx="35" ry="25" fill="white" />
                    </svg>
                </div>
            </div>

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-800 to-green-600 border-t-4 border-green-900" />
            <div className="absolute bottom-16 left-0 right-0 h-4 bg-gradient-to-b from-yellow-600 to-yellow-700" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 pb-20">

                {/* Animated Bird */}
                <div className="animate-bird-bounce mb-2">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        <ellipse cx="30" cy="30" rx="25" ry="20" fill="#fbbf24" />
                        <ellipse cx="42" cy="28" rx="8" ry="8" fill="white" />
                        <circle cx="44" cy="28" r="4" fill="black" />
                        <polygon points="50,30 65,28 50,34" fill="#f97316" />
                        <ellipse cx="20" cy="35" rx="12" ry="6" fill="#f59e0b" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-5xl font-bold font-mono text-white mb-2 animate-title-glow drop-shadow-[0_4px_0_rgba(0,0,0,0.3)]">
                    BASE
                </h1>
                <h1 className="text-5xl font-bold font-mono text-yellow-400 mb-6 animate-title-glow drop-shadow-[0_4px_0_rgba(0,0,0,0.3)]">
                    BIRD
                </h1>

                {/* Player Info */}
                {playerName && (
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 mb-6 text-center">
                        <p className="text-white font-mono text-sm">👤 {playerName}</p>
                        <p className="text-yellow-400 font-mono text-xs">🏆 Best: {highScore}</p>
                    </div>
                )}

                {/* Menu Buttons */}
                <div className="flex flex-col gap-4 w-full max-w-[280px]">
                    <button
                        onClick={onPlay}
                        className="menu-btn menu-btn-primary animate-pulse-glow animate-float"
                    >
                        ▶ PLAY
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onOpenShop}
                            className="menu-btn menu-btn-secondary flex-1 text-base py-3 px-4"
                        >
                            🛒 SHOP
                        </button>
                        <button
                            onClick={onOpenInventory}
                            className="menu-btn menu-btn-purple flex-1 text-base py-3 px-4"
                        >
                            🎒 ITEMS
                        </button>
                    </div>

                    <button
                        onClick={onOpenAchievements}
                        className="menu-btn menu-btn-yellow text-base py-3"
                    >
                        🏅 ACHIEVEMENTS
                    </button>

                    <button
                        onClick={onOpenLeaderboard}
                        className="menu-btn menu-btn-blue text-base py-3"
                    >
                        🏆 LEADERBOARD
                    </button>
                </div>
            </div>
        </div>
    );
}
