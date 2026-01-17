"use client";

import React from 'react';

interface NoBirdWarningProps {
    isOpen: boolean;
    onClose: () => void;
    onGoToShop: () => void;
}

export default function NoBirdWarning({
    isOpen,
    onClose,
    onGoToShop
}: NoBirdWarningProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-gradient-to-b from-zinc-800 to-zinc-900 border-4 border-yellow-500 p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] rounded-lg">

                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-5xl">🐦</span>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold font-mono text-yellow-400 text-center mb-3">
                    You Need a Bird!
                </h2>

                {/* Message */}
                <p className="text-gray-300 font-mono text-sm text-center mb-2">
                    To start playing, you need to own at least one bird.
                </p>
                <p className="text-green-400 font-mono text-sm text-center mb-6">
                    ✨ The <span className="font-bold">Base Blue Jay</span> is FREE!
                    <br />
                    <span className="text-gray-400 text-xs">(only gas fees required)</span>
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onGoToShop}
                        className="w-full py-3 px-6 bg-green-600 hover:bg-green-500 text-white font-bold font-mono text-lg border-4 border-green-400 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none transition-all"
                    >
                        🛒 GO TO SHOP
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-zinc-700 hover:bg-zinc-600 text-gray-300 font-mono text-sm border-2 border-gray-500 active:translate-y-0.5 transition-all"
                    >
                        Maybe Later
                    </button>
                </div>

                {/* Footer hint */}
                <p className="mt-4 text-[10px] text-gray-500 font-mono text-center">
                    💎 Connect your wallet and mint your first bird to start the adventure!
                </p>
            </div>
        </div>
    );
}
