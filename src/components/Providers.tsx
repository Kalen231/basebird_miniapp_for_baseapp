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
            // CRITICAL FIX: Call ready() FIRST to hide splash screen immediately
            // Per Farcaster docs: "If you don't call ready(), users will see an infinite loading screen"
            try {
                await sdk.actions.ready();
                console.log('✅ sdk.actions.ready() called immediately');
            } catch (readyError) {
                // Not in Farcaster environment - this is expected for local dev
                console.warn('sdk.actions.ready() failed (expected if not in Farcaster):', readyError);
            }

            // Now try to get context asynchronously (non-blocking)
            try {
                const timeoutPromise = new Promise<null>((_, reject) => {
                    setTimeout(() => reject(new Error('Context timeout')), SDK_CONTEXT_TIMEOUT_MS);
                });

                const result = await Promise.race([
                    sdk.context,
                    timeoutPromise
                ]);

                if (result) {
                    console.log('✅ Farcaster context loaded');
                    setContext(result);
                } else {
                    console.warn('⚠️ SDK returned null context');
                    setIsDevMode(true);
                    setContext(fallbackContext);
                }
            } catch (error) {
                // Timeout or error - use dev mode (this is fine)
                console.log('🎮 Using dev mode (context timeout or not in Farcaster)');
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
