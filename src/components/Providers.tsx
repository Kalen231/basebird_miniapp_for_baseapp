"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../config/wagmi';

const queryClient = new QueryClient();

interface FarcasterContextType {
    fid?: number;
    displayName?: string;
    username?: string;
    isLoading: boolean;
    isSDKLoaded: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
    isLoading: true,
    isSDKLoaded: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<any>(null);

    useEffect(() => {
        const initSDK = async () => {
            try {
                // Get context from Farcaster
                const ctx = await sdk.context;
                setContext(ctx);

                // CRITICAL: Call ready() to hide the splash screen
                await sdk.actions.ready();

                setIsSDKLoaded(true);
            } catch (error) {
                console.error('Failed to initialize Farcaster SDK:', error);

                // Fallback for local development
                setContext({
                    user: {
                        fid: 999999,
                        username: "local_dev_user",
                        displayName: "Local Dev User",
                        pfpUrl: "",
                    },
                });
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
