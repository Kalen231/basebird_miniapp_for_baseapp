"use client";

import React, { useEffect, useState } from 'react';
import { sdk } from "@farcaster/miniapp-sdk";

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

    const handleUserClick = (fid: number) => {
        try {
            sdk.actions.viewProfile({ fid });
        } catch (e) {
            console.error('Error opening profile:', e);
        }
    };

    if (!isOpen) return null;

    const getRankDisplay = (rank: number) => {
        if (rank === 1) return <span className="text-3xl drop-shadow-md">🥇</span>;
        if (rank === 2) return <span className="text-3xl drop-shadow-md">🥈</span>;
        if (rank === 3) return <span className="text-3xl drop-shadow-md">🥉</span>;
        return (
            <div className="w-8 h-8 flex items-center justify-center bg-blue-800/80 border-2 border-blue-600 rounded-full text-white font-bold text-sm shadow-sm">
                {rank}
            </div>
        );
    };

    const getRankStyles = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-900/40 to-yellow-600/20 border-yellow-500/50 hover:bg-yellow-900/50';
        if (rank === 2) return 'bg-gradient-to-r from-slate-700/40 to-slate-600/20 border-slate-400/50 hover:bg-slate-700/50';
        if (rank === 3) return 'bg-gradient-to-r from-amber-900/40 to-amber-700/20 border-amber-600/50 hover:bg-amber-900/50';
        return 'bg-blue-900/20 border-blue-800/30 hover:bg-blue-800/30';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-blue-950 border-2 border-blue-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.3)] max-h-[85vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 pt-2">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🏆</span>
                        <h2 className="text-2xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 uppercase" style={{ textShadow: '0 2px 10px rgba(59,130,246,0.5)' }}>
                            Leaderboard
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-900/30 text-blue-300 hover:bg-blue-800 hover:text-white transition-all border border-blue-800 hover:border-blue-500"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full shadow-lg border-blue-400/30" />
                            <p className="text-blue-400 font-mono text-sm animate-pulse">Loading scores...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 px-4 rounded-xl bg-red-900/20 border border-red-900/50">
                            <p className="text-red-400 font-mono mb-2">⚠️ {error}</p>
                            <button
                                onClick={fetchLeaderboard}
                                className="mt-4 px-6 py-2 bg-red-900/50 hover:bg-red-800/50 text-white font-mono text-sm rounded-lg transition-colors border border-red-700"
                            >
                                Retry Connection
                            </button>
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="text-center py-16 bg-blue-900/10 rounded-xl border border-blue-900/30">
                            <span className="text-4xl mb-4 block opacity-50">🦅</span>
                            <p className="text-blue-200 font-bold text-lg">No scores yet!</p>
                            <p className="text-blue-400 text-sm mt-1">Be the legend who sets the first record.</p>
                        </div>
                    ) : (
                        entries.map((entry) => (
                            <div
                                key={entry.fid}
                                onClick={() => handleUserClick(entry.fid)}
                                className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${getRankStyles(entry.rank)} ${currentFid === entry.fid ? 'ring-2 ring-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.2)]' : ''
                                    }`}
                            >
                                {/* Hover Effect Background */}
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-center gap-4 relative z-10">
                                    {/* Rank */}
                                    <div className="w-10 flex flex-col items-center justify-center">
                                        {getRankDisplay(entry.rank)}
                                    </div>

                                    {/* Player Info */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-bold font-mono text-sm sm:text-base truncate max-w-[140px] ${currentFid === entry.fid ? 'text-yellow-300' : 'text-white group-hover:text-blue-100'}`}>
                                                {entry.username || `FID: ${entry.fid}`}
                                            </p>
                                            {currentFid === entry.fid && (
                                                <span className="bg-yellow-500/20 text-yellow-300 text-[10px] px-1.5 py-0.5 rounded border border-yellow-500/30 font-bold">YOU</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-blue-400/80 font-mono flex items-center gap-1 group-hover:text-blue-300">
                                            View Profile <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="relative z-10 flex items-center gap-2">
                                    <div className="text-right">
                                        <p className="text-lg sm:text-xl font-black font-mono text-white tracking-wider filter drop-shadow-sm">
                                            {entry.high_score.toLocaleString()}
                                        </p>
                                        <p className="text-[9px] text-right text-white/40 font-mono uppercase tracking-widest">Score</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-blue-800/50 text-center">
                    <p className="text-blue-400/60 font-mono text-[10px] uppercase tracking-widest">
                        Top 10 Global Players
                    </p>
                </div>
            </div>
        </div>
    );
}
