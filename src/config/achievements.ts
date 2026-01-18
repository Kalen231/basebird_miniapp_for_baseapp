export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockCondition: 'first_game' | 'recast';
    mintPrice: number; // 0 = gas only
    imageUrl: string;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_game',
        name: 'First Flight',
        description: 'Play your first game',
        icon: '🎮',
        unlockCondition: 'first_game',
        mintPrice: 0,
        imageUrl: '/achievements/first_game.svg'
    },
    {
        id: 'recast_share',
        name: 'Spreader',
        description: 'Share the game with friends',
        icon: '🔄',
        unlockCondition: 'recast',
        mintPrice: 0,
        imageUrl: '/achievements/recast.svg'
    }
];

export const getAchievement = (id: string): Achievement | undefined => {
    return ACHIEVEMENTS.find(a => a.id === id);
};
