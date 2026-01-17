"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../config/wagmi';

const queryClient = new QueryClient();

// Timeout for SDK initialization (ms) - if exceeded, use fallback mode
const SDK_TIMEOUT_MS = 2000;

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
            // Check if we're definitely NOT in Farcaster (quick check)
            const isInIframe = typeof window !== 'undefined' && window.parent !== window;

            if (!isInIframe) {
                // Not in iframe = definitely not in Farcaster
                console.log('🎮 Not in iframe - using LOCAL DEV MODE');
                setIsDevMode(true);
                setContext(fallbackContext);
                setIsSDKLoaded(true);
                return;
            }

            // We might be in Farcaster - try with timeout using Promise.race
            const timeoutPromise = new Promise<null>((resolve) => {
                setTimeout(() => {
                    console.log('⏱️ SDK timeout - switching to dev mode');
                    resolve(null);
                }, SDK_TIMEOUT_MS);
            });

            try {
                const result = await Promise.race([
                    sdk.context,
                    timeoutPromise
                ]);

                if (result === null) {
                    // Timeout occurred
                    console.log('🎮 Running in LOCAL DEV MODE - using mock user data');
                    setIsDevMode(true);
                    setContext(fallbackContext);
                    setIsSDKLoaded(true);
                    // CRITICAL FIX: Tell Farcaster we are ready, even if we timed out (maybe SDK loaded late)
                    // This prevents the splash screen from hanging forever
                    try {
                        await sdk.actions.ready();
                    } catch (e) {
                        // Ignore error if not in Farcaster
                        console.warn('Failed to call ready() in timeout handler (expected if local):', e);
                    }
                    return;
                }

                // Got real context from Farcaster
                setContext(result);
                await sdk.actions.ready();
                setIsSDKLoaded(true);
            } catch (error) {
                console.error('Failed to initialize Farcaster SDK:', error);
                setIsDevMode(true);
                setContext(fallbackContext);
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
                    {children}
                </FarcasterContext.Provider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export const useFarcasterContext = () => useContext(FarcasterContext);
