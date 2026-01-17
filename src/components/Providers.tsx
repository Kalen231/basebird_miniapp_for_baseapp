"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../config/wagmi';
import { WagmiConnectionManager } from './WagmiConnectionManager';

const queryClient = new QueryClient();

// Timeout for SDK context (ms) - short timeout, context is non-blocking
const SDK_CONTEXT_TIMEOUT_MS = 1000;

interface FarcasterContextType {
    fid?: number;
    displayName?: string;
    username?: string;
    isLoading: boolean;
    isSDKLoaded: boolean;
    isDevMode: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
    isLoading: true,
    isSDKLoaded: false,
    isDevMode: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<any>(null);
    const [isDevMode, setIsDevMode] = useState(false);

    useEffect(() => {
        // Fallback context for local development
        const fallbackContext = {
            user: {
                fid: 999999,
                username: "local_dev_user",
                displayName: "🧪 Dev Mode",
                pfpUrl: "",
            },
        };

        const initSDK = async () => {
            // Check if ready() was already called by farcaster-init.js
            const readyAlreadyCalled = !!(window as any).__FARCASTER_READY_CALLED__;

            if (!readyAlreadyCalled) {
                // Fallback: call ready() now if init script didn't run
                try {
                    await sdk.actions.ready();
                    console.log('✅ sdk.actions.ready() called in React');
                } catch (e) {
                    console.log('⏭️ ready() call skipped (not in Farcaster)');
                }
            } else {
                console.log('✅ ready() was already called by init script');
            }

            // Fast detection using isInMiniApp
            try {
                const isMiniApp = await sdk.isInMiniApp();

                if (isMiniApp) {
                    const ctx = await sdk.context;
                    console.log('✅ Farcaster context loaded');
                    setContext(ctx);
                } else {
                    console.log('🎮 Not in Mini App, using dev mode');
                    setIsDevMode(true);
                    setContext(fallbackContext);
                }
            } catch (error) {
                console.log('🎮 Detection failed, using dev mode');
                setIsDevMode(true);
                setContext(fallbackContext);
            }

            setIsSDKLoaded(true);
        };

        initSDK();
    }, []);

    const value: FarcasterContextType = {
        fid: context?.user?.fid,
        displayName: context?.user?.displayName || context?.user?.username,
        username: context?.user?.username,
        isLoading: !context,
        isSDKLoaded,
        isDevMode,
    };

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <FarcasterContext.Provider value={value}>
                    <WagmiConnectionManager />
                    {children}
                </FarcasterContext.Provider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export const useFarcasterContext = () => useContext(FarcasterContext);
