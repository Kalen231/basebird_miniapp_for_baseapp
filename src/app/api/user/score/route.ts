import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { fid, score } = await request.json();

        if (!fid || typeof score !== 'number') {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        // Get current user to check high score
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('high_score')
            .eq('fid', fid)
            .single();

        if (fetchError) {
            console.error('Error fetching user for score update:', fetchError);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const currentHigh = user?.high_score || 0;

        if (score > currentHigh) {
            const { error: updateError } = await supabase
                .from('users')
                .update({ high_score: score })
                .eq('fid', fid);

            if (updateError) {
                console.error('Error updating score:', updateError);
                return NextResponse.json({ error: 'Failed to update score' }, { status: 500 });
            }
            return NextResponse.json({ success: true, newHighScore: score });
        }

        return NextResponse.json({ success: true, newHighScore: currentHigh, message: 'Score not higher' });

    } catch (error) {
        console.error('Score API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
