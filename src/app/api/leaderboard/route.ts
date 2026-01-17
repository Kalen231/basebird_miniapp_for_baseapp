import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('fid, username, high_score')
            .order('high_score', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        const leaderboard = (data || []).map((user, index) => ({
            rank: index + 1,
            fid: user.fid,
            username: user.username,
            high_score: user.high_score || 0
        }));

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
