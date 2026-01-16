"use client";

import { useEffect, useState } from "react";
import { useFarcasterContext } from "@/components/Providers";
import GameCanvas from "@/components/Game/GameCanvas";
import ShopModal from "@/components/Shop/ShopModal";

export default function Home() {
    const { fid, displayName, isLoading } = useFarcasterContext();
    const [highScore, setHighScore] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    // Shop State
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [ownedSkus, setOwnedSkus] = useState<string[]>(['default']);
    const [activeSkin, setActiveSkin] = useState('default');

    const syncUser = () => {
        if (!fid) return;
        setIsSyncing(true);
        fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fid, username: displayName })
        })
            .then(res => res.json())
            .then(data => {
                if (data.user?.high_score) {
                    setHighScore(data.user.high_score);
                }
                if (data.purchases) {
                    const skus = data.purchases.map((p: any) => p.sku_id);
                    setOwnedSkus(['default', ...skus]);
                }
            })
            .catch(err => console.error('Sync error:', err))
            .finally(() => setIsSyncing(false));
    };

    useEffect(() => {
        if (fid && displayName) {
            syncUser();
        }
    }, [fid, displayName]);

    if (isLoading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-900 text-white">
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-900">
            <div className="mb-4 text-white font-mono text-sm text-center flex flex-col gap-1">
                <div>Player: {displayName} (FID: {fid})</div>
                {isSyncing && <span className="text-xs text-gray-400">Syncing...</span>}
            </div>

            <GameCanvas
                fid={fid}
                initialHighScore={highScore}
                activeSkin={activeSkin}
            />

            <div className="mt-6 w-full max-w-[430px] flex justify-center">
                <button
                    onClick={() => setIsShopOpen(true)}
                    className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded border-4 border-yellow-600 font-mono shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all"
                >
                    OPEN SHOP 🛒
                </button>
            </div>

            <ShopModal
                isOpen={isShopOpen}
                onClose={() => setIsShopOpen(false)}
                ownedSkus={ownedSkus}
                activeSkin={activeSkin}
                onEquip={(sku) => setActiveSkin(sku)}
                onPurchaseSuccess={(sku) => {
                    syncUser(); // Refresh purchases
                    setOwnedSkus(prev => [...prev, sku]); // Optimistic update
                }}
            />
        </main>
    );
}
