import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { fid, username } = await request.json();

        if (!fid) {
            return NextResponse.json({ error: 'FID is required' }, { status: 400 });
        }

        // First, try to get existing user
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('fid', fid)
            .single();

        let userData;

        if (fetchError?.code === 'PGRST116') {
            // User doesn't exist - create new one
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert({ fid, username, high_score: 0, games_played: 0 })
                .select()
                .single();

            if (insertError) {
                console.error('Error creating user:', insertError);
                return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
            }
            userData = newUser;
        } else if (fetchError) {
            console.error('Error fetching user:', fetchError);
            return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
        } else {
            // User exists - only update username if changed, NEVER touch high_score
            if (username && existingUser.username !== username) {
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ username })
                    .eq('fid', fid);

                if (updateError) {
                    console.error('Error updating username:', updateError);
                }
            }
            userData = existingUser;
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
