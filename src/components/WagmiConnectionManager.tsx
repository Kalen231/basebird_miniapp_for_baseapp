"use client";

import { useEffect } from 'react';
import { useConnect, useAccount } from 'wagmi';
import { useFarcasterContext } from './Providers';

export function WagmiConnectionManager() {
    const { connect, connectors, error: connectError } = useConnect();
    const { isConnected, isConnecting, status } = useAccount();
    const { isSDKLoaded, isDevMode } = useFarcasterContext();

    useEffect(() => {
        if (isConnected || isConnecting) return;
        if (!isSDKLoaded) return; // Wait for SDK to be ready

        console.log('🔄 Wagmi Connection Manager: Checking connection...', {
            isSDKLoaded,
            isDevMode,
            availableConnectors: connectors.map(c => c.id)
        });

        // specific strategy for miniapp
        const miniappConnector = connectors.find(c =>
            c.id === 'farcaster-miniapp' ||
            c.name.toLowerCase().includes('farcaster')
        );

        if (miniappConnector) {
            console.log('🔌 Found Farcaster connector, attempting to connect...', miniappConnector.name);
            try {
                connect({ connector: miniappConnector });
            } catch (err) {
                console.error('❌ Failed to initiate connection:', err);
            }
        } else {
            console.warn('⚠️ Farcaster MiniApp connector NOT FOUND. Available:', connectors.map(c => c.name));
        }

    }, [isConnected, isConnecting, isSDKLoaded, connect, connectors, isDevMode]);

    useEffect(() => {
        if (connectError) {
            console.error('❌ Wagmi connection error:', connectError);
        }
    }, [connectError]);

    return null;
}
