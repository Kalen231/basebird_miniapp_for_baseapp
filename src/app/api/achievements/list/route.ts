import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const { fid } = await request.json();

        if (!fid) {
            return NextResponse.json({ error: 'FID is required' }, { status: 400 });
        }

        // Get user's achievements with their status
        const { data: userAchievements, error: achievementsError } = await supabase
            .from('achievements')
            .select('*')
            .eq('fid', fid);

        if (achievementsError) {
            console.error('Error fetching achievements:', achievementsError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // Get user's games_played count
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('games_played')
            .eq('fid', fid)
            .single();

        return NextResponse.json({
            achievements: userAchievements || [],
            gamesPlayed: userData?.games_played || 0
        });
    } catch (err) {
        console.error('Error in achievements list:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
