"use client";

import { createContext, useContext, useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../config/wagmi';

const queryClient = new QueryClient();

interface FarcasterContextType {
    fid?: number;
    displayName?: string;
    isLoading: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
    isLoading: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const [context, setContext] = useState<any>();

    useEffect(() => {
        const load = async () => {
            setContext(await sdk.context);
            sdk.actions.ready();
        };

        if (sdk && !isSDKLoaded) {
            setIsSDKLoaded(true);
            load();
        }

        // Mock context for local development (timeout fallback)
        const timer = setTimeout(() => {
            if (!context) {
                setContext({
                    user: {
                        fid: 999999,
                        username: "local_dev_user",
                        displayName: "Local Dev User",
                        pfpUrl: "",
                    },
                });
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [isSDKLoaded, context]);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <FarcasterContext.Provider
                    value={{
                        fid: context?.user.fid,
                        displayName: context?.user.displayName,
                        isLoading: !isSDKLoaded || !context,
                    }}
                >
                    {children}
                </FarcasterContext.Provider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

// Context logic moved to Providers.tsx, but exporting hook from here would be cleaner.
// For now, keeping it simple as per "don't overcomplicate" rule.
export const useFarcasterContext = () => useContext(FarcasterContext);
