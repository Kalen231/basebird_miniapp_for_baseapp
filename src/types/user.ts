export interface UserAchievement {
    id: string;
    fid: number;
    achievement_id: string;
    unlocked_at: string;
    minted: boolean;
    mint_tx_hash: string | null;
}

export interface UserData {
    high_score?: number;
    games_played?: number;
}

export interface Purchase {
    sku_id: string;
    [key: string]: any;
}

export interface SyncResponse {
    user: UserData;
    purchases: Purchase[];
}

export interface AchievementsResponse {
    achievements: UserAchievement[];
    gamesPlayed: number;
}
