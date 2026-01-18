import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { ACHIEVEMENTS } from '@/config/achievements';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

const publicClient = createPublicClient({
    chain: base,
    transport: http()
});

export async function POST(request: Request) {
    try {
        const { fid, achievementId, txHash } = await request.json();

        if (!fid || !achievementId || !txHash) {
            return NextResponse.json(
                { error: 'FID, achievementId and txHash are required' },
                { status: 400 }
            );
        }

        // Verify achievement exists
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) {
            return NextResponse.json(
                { error: 'Achievement not found' },
                { status: 404 }
            );
        }

        // Check if achievement is unlocked
        const { data: existingAchievement, error: fetchError } = await supabase
            .from('achievements')
            .select('*')
            .eq('fid', fid)
            .eq('achievement_id', achievementId)
            .single();

        if (fetchError || !existingAchievement) {
            return NextResponse.json(
                { error: 'Achievement not unlocked yet' },
                { status: 400 }
            );
        }

        if (existingAchievement.minted) {
            return NextResponse.json(
                { error: 'Achievement already minted' },
                { status: 400 }
            );
        }

        // Verify the transaction on blockchain
        const receipt = await publicClient.getTransactionReceipt({
            hash: txHash as `0x${string}`
        });

        if (receipt.status !== 'success') {
            return NextResponse.json(
                { error: 'Transaction failed' },
                { status: 400 }
            );
        }

        // Update achievement as minted
        const { error: updateError } = await supabase
            .from('achievements')
            .update({
                minted: true,
                mint_tx_hash: txHash
            })
            .eq('fid', fid)
            .eq('achievement_id', achievementId);

        if (updateError) {
            console.error('Error updating achievement:', updateError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Achievement minted successfully!',
            txHash
        });
    } catch (err) {
        console.error('Error in achievement mint:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
