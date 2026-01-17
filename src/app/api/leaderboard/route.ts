import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Отключаем кеширование - данные всегда свежие из БД
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

        // Return with no-cache headers to ensure fresh data
        return NextResponse.json({ leaderboard }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
