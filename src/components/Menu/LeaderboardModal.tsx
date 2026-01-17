"use client";

import React, { useEffect, useState } from 'react';

interface LeaderboardEntry {
    rank: number;
    username: string;
    fid: number;
    high_score: number;
}

interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFid?: number;
}

export default function LeaderboardModal({
    isOpen,
    onClose,
    currentFid
}: LeaderboardModalProps) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchLeaderboard();
        }
    }, [isOpen]);

    const fetchLeaderboard = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/leaderboard');
            if (!res.ok) throw new Error('Failed to load');
            const data = await res.json();
            setEntries(data.leaderboard || []);
        } catch (err) {
            setError('Could not load leaderboard');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const getRankEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'from-yellow-500/30 to-yellow-600/20 border-yellow-500';
        if (rank === 2) return 'from-gray-400/30 to-gray-500/20 border-gray-400';
        if (rank === 3) return 'from-amber-600/30 to-amber-700/20 border-amber-600';
        return 'from-blue-900/30 to-blue-950/20 border-blue-700';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-gradient-to-b from-blue-900 to-blue-950 border-4 border-blue-500 rounded-xl p-6 shadow-[0_8px_0_0_#1e3a8a,0_12px_30px_rgba(0,0,0,0.5)] max-h-[80vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b-2 border-blue-600 pb-3">
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                        🏆 LEADERBOARD
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-blue-300 hover:text-white font-mono text-xl font-bold transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 -mr-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-400 font-mono">{error}</p>
                            <button
                                onClick={fetchLeaderboard}
                                className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-mono text-sm rounded-lg transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-blue-300 font-mono">No scores yet!</p>
                            <p className="text-blue-400 font-mono text-sm mt-2">Be the first to set a record</p>
                        </div>
                    ) : (
                        entries.map((entry, index) => (
                            <div
                                key={entry.fid}
                                className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r border-2 transition-all ${getRankColor(entry.rank)} ${currentFid === entry.fid ? 'ring-2 ring-yellow-400' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Rank */}
                                    <div className="w-10 text-center font-bold font-mono text-lg">
                                        {getRankEmoji(entry.rank)}
                                    </div>

                                    {/* Player Info */}
                                    <div>
                                        <p className={`font-bold font-mono text-sm ${currentFid === entry.fid ? 'text-yellow-400' : 'text-white'}`}>
                                            {entry.username || `FID ${entry.fid}`}
                                        </p>
                                        {currentFid === entry.fid && (
                                            <span className="text-[10px] text-yellow-400 font-mono">YOU</span>
                                        )}
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="text-right">
                                    <p className="text-xl font-bold font-mono text-white">
                                        {entry.high_score}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t-2 border-blue-700 text-center">
                    <p className="text-blue-400 font-mono text-xs">
                        Top 10 players by high score
                    </p>
                </div>
            </div>
        </div>
    );
}
