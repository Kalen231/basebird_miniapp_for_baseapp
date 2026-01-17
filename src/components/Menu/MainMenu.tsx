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
    isLoading?: boolean;
}

export default function MainMenu({
    onPlay,
    onOpenShop,
    onOpenInventory,
    onOpenLeaderboard,
    onOpenAchievements,
    playerName,
    highScore = 0,
    isLoading = false
}: MainMenuProps) {
    return (
        <div className="relative w-full max-w-[430px] mx-auto h-[600px] overflow-hidden border-2 border-cyan-400/30 bg-[#0A0B14] rounded-lg shadow-[0_0_20px_rgba(0,212,255,0.2)]">
            {/* New Crypto Background */}
            <div className="absolute inset-0">
                <img
                    src="/background_new.svg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-80"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 pb-20">

                {/* Animated Bird (Recolored to Base Blue) */}
                <div className="animate-bird-bounce mb-6">
                    <svg width="60" height="60" viewBox="0 0 60 60">
                        {/* Body */}
                        <ellipse cx="30" cy="30" rx="25" ry="20" fill="#3B82F6" />
                        <ellipse cx="30" cy="35" rx="20" ry="12" fill="#60A5FA" opacity="0.5" />
                        {/* Eye */}
                        <ellipse cx="42" cy="28" rx="8" ry="8" fill="white" />
                        <circle cx="44" cy="28" r="4" fill="black" />
                        {/* Beak */}
                        <polygon points="50,30 65,28 50,34" fill="#F97316" />
                        {/* Wing */}
                        <ellipse cx="20" cy="35" rx="12" ry="6" fill="#1D4ED8" />
                    </svg>
                </div>

                {/* Title */}
                <h1 className="text-5xl font-bold font-mono text-white mb-2 animate-title-glow drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                    BASE
                </h1>
                <h1 className="text-5xl font-bold font-mono text-cyan-400 mb-8 animate-title-glow drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]">
                    BIRD
                </h1>

                {/* Player Info */}
                {playerName && (
                    <div className="bg-[#1E293B]/80 backdrop-blur-md border border-cyan-500/30 rounded-lg px-6 py-3 mb-8 text-center shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                        <p className="text-blue-100 font-mono text-sm mb-1">👤 {playerName}</p>
                        <p className="text-cyan-400 font-mono text-xs font-bold tracking-wider">🏆 BEST: {highScore}</p>
                    </div>
                )}

                {/* Menu Buttons */}
                <div className="flex flex-col gap-4 w-full max-w-[280px]">
                    <button
                        onClick={onPlay}
                        disabled={isLoading}
                        className={`menu-btn menu-btn-primary animate-pulse-glow animate-float ${isLoading ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                        {isLoading ? '⏳ LOADING...' : '▶ PLAY'}
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
