"use client";

import React from 'react';
import { usePurchaseItem } from '@/hooks/usePurchaseItem';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    ownedSkus: string[];
    activeSkin: string;
    onEquip: (sku: string) => void;
    onPurchaseSuccess: (sku: string) => void;
}

export default function ShopModal({
    isOpen,
    onClose,
    ownedSkus,
    activeSkin,
    onEquip,
    onPurchaseSuccess
}: ShopModalProps) {
    // Hook for Small Bird (0.0005 ETH)
    const {
        mutate: buySmallBird,
        isPending: isBuyingSmallBird,
        error: smallBirdError
    } = usePurchaseItem('small_bird', '0.0005');

    if (!isOpen) return null;

    const handleBuySmallBird = () => {
        buySmallBird(undefined, {
            onSuccess: () => {
                onPurchaseSuccess('small_bird');
            }
        });
    };

    const isOwned = (sku: string) => ownedSkus.includes(sku);
    const isActive = (sku: string) => activeSkin === sku;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md bg-zinc-800 border-4 border-gray-400 p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b-2 border-gray-600 pb-2">
                    <h2 className="text-2xl font-bold font-mono text-yellow-400">SHOP</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white font-mono text-xl font-bold"
                    >
                        [X]
                    </button>
                </div>

                {/* Items List */}
                <div className="space-y-4">

                    {/* Item 1: Big Bird (Default) */}
                    <div className="flex items-center justify-between p-4 bg-zinc-900 border-2 border-gray-600">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-yellow-400 border-2 border-white"></div>
                            <div>
                                <h3 className="font-bold text-white font-mono">Big Bird</h3>
                                <p className="text-xs text-gray-400 font-mono">Standard Hitbox</p>
                            </div>
                        </div>
                        <div className="text-right">
                            {isActive('default') ? (
                                <span className="text-green-400 font-bold font-mono text-sm">[EQUIPPED]</span>
                            ) : (
                                <button
                                    onClick={() => onEquip('default')}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold font-mono text-xs border-2 border-gray-500 active:translate-y-1"
                                >
                                    EQUIP
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Item 2: Small Bird (Paid) */}
                    <div className="flex items-center justify-between p-4 bg-zinc-900 border-2 border-gray-600">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-yellow-400 border-2 border-white"></div> {/* Slightly smaller visual? Or just icon */}
                            <div>
                                <h3 className="font-bold text-white font-mono">Small Bird</h3>
                                <p className="text-xs text-yellow-200 font-mono">Hitbox -30% (P2W)</p>
                                <p className="text-xs text-blue-300 font-mono">Price: 0.0005 ETH</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            {isOwned('small_bird') ? (
                                isActive('small_bird') ? (
                                    <span className="text-green-400 font-bold font-mono text-sm">[EQUIPPED]</span>
                                ) : (
                                    <button
                                        onClick={() => onEquip('small_bird')}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold font-mono text-xs border-2 border-gray-500 active:translate-y-1"
                                    >
                                        EQUIP
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={handleBuySmallBird}
                                    disabled={isBuyingSmallBird}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs border-2 border-blue-400 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isBuyingSmallBird ? 'BUYING...' : 'BUY'}
                                </button>
                            )}
                            {smallBirdError && (
                                <span className="text-red-500 text-[10px] pr-1 mt-1 font-mono max-w-[100px] text-right leading-tight">
                                    {smallBirdError.message}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Coming Soon */}
                    <div className="p-4 border-2 border-dashed border-gray-700 text-center opacity-50">
                        <p className="text-gray-500 font-mono text-sm">More skins coming soon...</p>
                    </div>

                </div>

            </div>
        </div>
    );
}
