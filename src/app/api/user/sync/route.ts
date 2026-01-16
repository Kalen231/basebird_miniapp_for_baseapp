import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { fid, username } = await request.json();

        if (!fid) {
            return NextResponse.json({ error: 'FID is required' }, { status: 400 });
        }

        // Upsert user (update username if exists, create if not)
        // We do NOT include high_score here to avoid overwriting it on sync
        const { data: userData, error: userError } = await supabase
            .from('users')
            .upsert(
                { fid, username },
                { onConflict: 'fid' }
            )
            .select()
            .single();

        if (userError) {
            console.error('Error syncing user:', userError);
            return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
        }

        // Get purchases
        const { data: purchases, error: purchaseError } = await supabase
            .from('purchases')
            .select('*')
            .eq('fid', fid);

        if (purchaseError) {
            console.error('Error fetching purchases:', purchaseError);
        }

        return NextResponse.json({ user: userData, purchases: purchases || [] });

    } catch (error) {
        console.error('Sync API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
