import { useSendTransaction } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { parseEther } from 'viem';
import { useMutation } from '@tanstack/react-query';
import { useFarcasterContext } from '@/components/Providers';
import { config } from '@/config/wagmi';

export function usePurchaseItem(skuId: string, priceInEth: string) {
    const { sendTransactionAsync } = useSendTransaction();
    const { fid } = useFarcasterContext();
    const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;

    return useMutation({
        mutationKey: ['purchase', skuId],
        mutationFn: async () => {
            if (!fid) throw new Error("User not logged in");
            if (!adminWallet) throw new Error("Admin wallet not configured");

            // 1. Send Transaction
            const hash = await sendTransactionAsync({
                to: adminWallet as `0x${string}`,
                value: parseEther(priceInEth),
            });

            // 2. Wait for confirmation
            await waitForTransactionReceipt(config, { hash });

            // 3. Verify on backend
            const response = await fetch('/api/verify-transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fid,
                    txHash: hash,
                    skuId,
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Verification failed');
            }

            return { hash, success: true };
        },
    });
}
