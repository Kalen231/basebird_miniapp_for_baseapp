"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useSendCalls } from 'wagmi/experimental';
import { parseEther, toHex } from 'viem';
import { useMutation } from '@tanstack/react-query';
import { useFarcasterContext } from '@/components/Providers';
import { config } from '@/config/wagmi';
import { SKINS, Skin } from '@/config/skins';

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
    const { sendCallsAsync } = useSendCalls();
    const { fid } = useFarcasterContext();
    const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET || '0xf8d2b260F0c91ef80659acFAAA8a868C34dd4d71';
    console.log('[ShopModal] Admin wallet:', adminWallet);

    const [buyingSkuId, setBuyingSkuId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const purchaseMutation = useMutation({
        mutationKey: ['purchase'],
        mutationFn: async ({ skuId, priceInEth, isMintable }: { skuId: string; priceInEth: string; isMintable?: boolean }) => {
            if (!fid) throw new Error("User not logged in");
            if (!adminWallet) throw new Error("Admin wallet not configured");

            setBuyingSkuId(skuId);
            setError(null);

            // Ensure connected
            // Note: In Farcaster, we expect auto-connect. If not connected, we should error or try to connect.
            // But useSendTransaction usually throws if not connected.


            // 1. Send Transaction using wallet_sendCalls (EIP-5792)
            // This works on both Farcaster and Base App
            // For mintable birds (isMintable=true), send 0 ETH - user only pays gas
            const transactionValue = isMintable ? parseEther("0") : parseEther(priceInEth);
            const result = await sendCallsAsync({
                calls: [{
                    to: adminWallet as `0x${string}`,
                    value: transactionValue,
                    // Base App requires data field for zero-value transactions
                    data: isMintable ? toHex(`mint:${skuId}`) : undefined,
                }],
            });

            // sendCalls returns batch id, use it as hash for verification
            const hash = result as `0x${string}`;

            // 3. Verify on backend
            const response = await fetch('/api/verify-transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fid,
                    txHash: hash,
                    skuId,
                    isMintable, // Pass mint flag to backend
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Verification failed');
            }

            return { hash, success: true, skuId };
        },
        onSuccess: (data) => {
            onPurchaseSuccess(data.skuId);
            setBuyingSkuId(null);
        },
        onError: (err) => {
            // Check for user rejection
            const isUserRejection =
                err.message.includes("User rejected the request") ||
                err.message.includes("User denied transaction signature") ||
                err.name === 'UserRejectedRequestError';

            if (isUserRejection) {
                // User cancelled, just log info
                console.log("Purchase cancelled by user");
                setBuyingSkuId(null);
                return;
            }

            console.error("Purchase error:", err);

            if (err.message.includes("Connector not connected")) {
                setError("Wallet disconnected. Please reload the frame.");
            } else {
                setError(err.message);
            }
            setBuyingSkuId(null);
        }
    });

    if (!isOpen) return null;

    const handleBuy = (skin: Skin) => {
        purchaseMutation.mutate({
            skuId: skin.skuId,
            priceInEth: skin.price.toString(),
            isMintable: skin.isMintable
        });
    };

    const isOwned = (sku: string) => ownedSkus.includes(sku);
    const isActive = (sku: string) => activeSkin === sku;
    const isBuying = (sku: string) => buyingSkuId === sku;

    const formatPrice = (skin: Skin) => {
        if (skin.isMintable) {
            return 'MINT (gas only)';
        }
        return `${skin.price} ETH`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg bg-zinc-800 border-4 border-gray-400 p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] max-h-[80vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b-2 border-gray-600 pb-2">
                    <h2 className="text-2xl font-bold font-mono text-yellow-400">🐦 BIRD SHOP</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white font-mono text-xl font-bold"
                    >
                        [X]
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-2 bg-red-900/50 border border-red-500 text-red-300 text-xs font-mono">
                        ❌ {error}
                    </div>
                )}

                {/* Items List - Scrollable */}
                <div className="space-y-3 overflow-y-auto pr-2 flex-1">

                    {SKINS.map((skin) => (
                        <div
                            key={skin.id}
                            className={`flex items-center justify-between p-3 bg-zinc-900 border-2 ${isActive(skin.skuId) ? 'border-green-500' : 'border-gray-600'
                                } transition-all`}
                        >
                            {/* Left: Image + Info */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 relative bg-zinc-700 border border-gray-500 rounded overflow-hidden">
                                    <Image
                                        src={skin.assetPath}
                                        alt={skin.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white font-mono text-sm">
                                        {skin.name}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 font-mono leading-tight">
                                        {skin.visualFeature}
                                    </p>
                                    <p className={`text-xs font-mono mt-1 ${skin.isMintable ? 'text-green-300' : 'text-blue-300'
                                        }`}>
                                        {formatPrice(skin)}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Action Buttons */}
                            <div className="text-right flex flex-col items-end min-w-[80px]">
                                {isOwned(skin.skuId) ? (
                                    isActive(skin.skuId) ? (
                                        <span className="text-green-400 font-bold font-mono text-xs">[EQUIPPED]</span>
                                    ) : (
                                        <button
                                            onClick={() => onEquip(skin.skuId)}
                                            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white font-bold font-mono text-xs border-2 border-gray-500 active:translate-y-0.5"
                                        >
                                            EQUIP
                                        </button>
                                    )
                                ) : (
                                    <button
                                        onClick={() => handleBuy(skin)}
                                        disabled={isBuying(skin.skuId) || purchaseMutation.isPending}
                                        className={`px-3 py-1.5 font-bold font-mono text-xs border-2 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${skin.isMintable
                                            ? 'bg-green-600 hover:bg-green-500 text-white border-green-400'
                                            : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400'
                                            }`}
                                    >
                                        {isBuying(skin.skuId)
                                            ? (skin.isMintable ? 'MINTING...' : 'BUYING...')
                                            : (skin.isMintable ? 'MINT' : 'BUY')}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                </div>

                {/* Footer Info */}
                <div className="mt-4 pt-3 border-t border-gray-600">
                    <p className="text-[10px] text-gray-500 font-mono text-center">
                        🎮 First bird required to play! Mint the Base Blue Jay for FREE (gas only)
                    </p>
                </div>

            </div>
        </div>
    );
}
