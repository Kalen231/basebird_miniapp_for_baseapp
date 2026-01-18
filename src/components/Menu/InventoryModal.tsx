"use client";

import React from 'react';
import Image from 'next/image';
import { SKINS as ALL_SKINS } from '@/config/skins';

interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    ownedSkus: string[];
    activeSkin: string;
    onEquip: (sku: string) => void;
}

export default function InventoryModal({
    isOpen,
    onClose,
    ownedSkus,
    activeSkin,
    onEquip
}: InventoryModalProps) {
    if (!isOpen) return null;

    // Filter owned skins from the master config
    const ownedSkins = ALL_SKINS.filter(skin => ownedSkus.includes(skin.skuId));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-gradient-to-b from-purple-900 to-purple-950 border-4 border-purple-500 rounded-xl p-6 shadow-[0_8px_0_0_#581c87,0_12px_30px_rgba(0,0,0,0.5)] max-h-[80vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b-2 border-purple-600 pb-3">
                    <h2 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
                        🎒 INVENTORY
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-purple-300 hover:text-white font-mono text-xl font-bold transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Skins Grid - Scrollable */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                    {ownedSkins.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-purple-300 font-mono">No birds yet!</p>
                            <p className="text-purple-400 font-mono text-sm mt-2">Visit the shop to mint or buy skins</p>
                        </div>
                    ) : (
                        ownedSkins.map((skin, index) => (
                            <div
                                key={skin.skuId}
                                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${activeSkin === skin.skuId
                                    ? 'bg-purple-700/50 border-yellow-400'
                                    : 'bg-purple-800/50 border-purple-600 hover:border-purple-400'
                                    }`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Skin Preview */}
                                    <div className="w-12 h-12 relative bg-purple-700/50 rounded-lg border-2 border-purple-400 overflow-hidden">
                                        <Image
                                            src={skin.assetPath}
                                            alt={skin.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-white font-mono text-sm">{skin.name}</h3>
                                        <p className="text-xs text-purple-300 font-mono">{skin.visualFeature}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {activeSkin === skin.skuId ? (
                                        <span className="bg-yellow-400 text-black font-bold font-mono text-xs px-3 py-1 rounded-full">
                                            EQUIPPED
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => onEquip(skin.skuId)}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs rounded-lg border-2 border-purple-400 transition-all active:translate-y-1"
                                        >
                                            EQUIP
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Hint */}
                <div className="mt-4 pt-3 border-t border-purple-600 text-center">
                    <p className="text-purple-400 font-mono text-xs">
                        {ownedSkins.length} / {ALL_SKINS.length} skins owned
                    </p>
                </div>
            </div>
        </div>
    );
}
