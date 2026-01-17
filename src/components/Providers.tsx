"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../config/wagmi';
import { WagmiConnectionManager } from './WagmiConnectionManager';

const queryClient = new QueryClient();

// Timeout for SDK initialization (ms) - increased for production reliability
const SDK_TIMEOUT_MS = 10000;

interface FarcasterContextType {
    fid?: number;
    displayName?: string;
    username?: string;
    isLoading: boolean;
    isSDKLoaded: boolean;
    isDevMode: boolean; // New: indicates running in dev/local mode
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
            let shouldCallReady = true;

            try {
                // Try to get context with increased timeout for production
                const timeoutPromise = new Promise<null>((_, reject) => {
                    setTimeout(() => {
                        reject(new Error('SDK context timeout'));
                    }, SDK_TIMEOUT_MS);
                });

                const result = await Promise.race([
                    sdk.context,
                    timeoutPromise
                ]);

                if (result) {
                    // Got real context from Farcaster
                    console.log('✅ Farcaster SDK context loaded successfully');
                    setContext(result);
                } else {
                    // Unexpected null result
                    console.warn('⚠️ SDK returned null context, using dev mode');
                    setIsDevMode(true);
                    setContext(fallbackContext);
                }
            } catch (error) {
                // Timeout or other error - use dev mode
                console.warn('🎮 SDK init failed, using dev mode:', error);
                setIsDevMode(true);
                setContext(fallbackContext);
            } finally {
                // CRITICAL: ALWAYS call ready() to hide splash screen
                // This runs regardless of success or failure above
                if (shouldCallReady) {
                    try {
                        await sdk.actions.ready();
                        console.log('✅ sdk.actions.ready() called successfully');
                    } catch (readyError) {
                        // Log but don't crash - we're probably not in Farcaster
                        console.warn('sdk.actions.ready() failed (expected if not in Farcaster):', readyError);
                    }
                }
                setIsSDKLoaded(true);
            }
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
