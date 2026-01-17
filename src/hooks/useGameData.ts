import { useState, useCallback } from 'react';
import { UserAchievement, SyncResponse, AchievementsResponse } from '@/types/user';

interface UseGameDataProps {
    fid?: number;
    displayName?: string;
}

export function useGameData({ fid, displayName }: UseGameDataProps) {
    const [highScore, setHighScore] = useState(0);
    const [gamesPlayed, setGamesPlayed] = useState(0);
    const [ownedSkus, setOwnedSkus] = useState<string[]>([]);
    const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasInitialized, setHasInitialized] = useState(false);

    const syncUser = useCallback(() => {
        if (!fid) return;
        setIsSyncing(true);
        fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fid, username: displayName })
        })
            .then(res => res.json())
            .then((data: SyncResponse) => {
                if (data.user?.high_score) {
                    setHighScore(data.user.high_score);
                }
                if (data.user?.games_played !== undefined) {
                    setGamesPlayed(data.user.games_played);
                }
                if (data.purchases) {
                    const skus = data.purchases.map((p) => p.sku_id);
                    setOwnedSkus(skus);
                }
            })
            .catch(err => console.error('Sync error:', err))
            .finally(() => {
                setIsSyncing(false);
                setHasInitialized(true);
            });
    }, [fid, displayName]);

    const fetchAchievements = useCallback(() => {
        if (!fid) return;
        fetch('/api/achievements/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fid })
        })
            .then(res => res.json())
            .then((data: AchievementsResponse) => {
                if (data.achievements) {
                    setUserAchievements(data.achievements);
                }
                if (data.gamesPlayed !== undefined) {
                    setGamesPlayed(data.gamesPlayed);
                }
            })
            .catch(err => console.error('Achievements fetch error:', err));
    }, [fid]);

    const unlockAchievement = useCallback(async (achievementId: string) => {
        if (!fid) return;
        try {
            const response = await fetch('/api/achievements/unlock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fid, achievementId })
            });
            if (response.ok) {
                fetchAchievements();
            }
        } catch (err) {
            console.error('Unlock achievement error:', err);
        }
    }, [fid, fetchAchievements]);

    return {
        highScore,
        setHighScore,
        gamesPlayed,
        ownedSkus,
        setOwnedSkus,
        userAchievements,
        isSyncing,
        hasInitialized,
        syncUser,
        fetchAchievements,
        unlockAchievement
    };
}
