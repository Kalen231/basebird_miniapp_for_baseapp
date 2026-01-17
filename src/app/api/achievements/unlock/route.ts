import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ACHIEVEMENTS } from '@/config/achievements';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const { fid, achievementId } = await request.json();

        if (!fid || !achievementId) {
            return NextResponse.json(
                { error: 'FID and achievementId are required' },
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

        // Check if already unlocked
        const { data: existing } = await supabase
            .from('achievements')
            .select('*')
            .eq('fid', fid)
            .eq('achievement_id', achievementId)
            .single();

        if (existing) {
            return NextResponse.json({
                success: true,
                message: 'Achievement already unlocked',
                achievement: existing
            });
        }

        // Insert new achievement unlock
        const { data: newAchievement, error: insertError } = await supabase
            .from('achievements')
            .insert({
                fid,
                achievement_id: achievementId,
                minted: false
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error unlocking achievement:', insertError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Achievement unlocked!',
            achievement: newAchievement
        });
    } catch (err) {
        console.error('Error in achievement unlock:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
