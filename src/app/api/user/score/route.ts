import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { fid, score } = await request.json();

        if (!fid || typeof score !== 'number') {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        // Get current user to check high score and games_played
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('high_score, games_played')
            .eq('fid', fid)
            .single();

        if (fetchError) {
            console.error('Error fetching user for score update:', fetchError);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const currentHigh = user?.high_score || 0;
        const currentGamesPlayed = user?.games_played || 0;
        const newGamesPlayed = currentGamesPlayed + 1;

        // Always increment games_played, optionally update high_score
        const updateData: { games_played: number; high_score?: number } = {
            games_played: newGamesPlayed
        };

        if (score > currentHigh) {
            updateData.high_score = score;
        }

        const { error: updateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('fid', fid);

        if (updateError) {
            console.error('Error updating score:', updateError);
            return NextResponse.json({ error: 'Failed to update score' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            newHighScore: score > currentHigh ? score : currentHigh,
            isNewRecord: score > currentHigh,
            gamesPlayed: newGamesPlayed,
            message: score > currentHigh ? 'New high score!' : 'Score recorded'
        });

    } catch (error) {
        console.error('Score API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

