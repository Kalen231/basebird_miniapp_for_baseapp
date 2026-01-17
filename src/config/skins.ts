export interface Skin {
    id: string;
    name: string;
    assetPath: string;
    description: string;
    visualFeature: string;
    trailStyle: string; // Placeholder for future particle effects
    price: number; // Price in ETH, 0.0001 for mintable base bird
    skuId: string; // For purchase logic
    isMintable?: boolean; // True for base bird - only gas cost
}

export const SKINS: Skin[] = [
    {
        id: 'base_blue_jay',
        name: 'Base Blue Jay',
        assetPath: '/skins/base_blue_jay.png',
        description: 'Clean minimalism. Matte "base-blue" body with a halo ring.',
        visualFeature: 'Halo ring',
        trailStyle: 'blocks',
        price: 0.0001,
        skuId: 'base_blue_jay',
        isMintable: true // Free mint, only gas cost
    },
    {
        id: 'solana_neon_swallow',
        name: 'Solana Neon Swallow',
        assetPath: '/skins/solana_neon_swallow.png',
        description: 'Dark body with neon gradient stripes. Cyberpunk aesthetic.',
        visualFeature: 'Neon stripes',
        trailStyle: 'scanlines',
        price: 0.001,
        skuId: 'solana_neon_swallow'
    },
    {
        id: 'clanker_chrome_crow',
        name: 'Clanker Chrome Crow',
        assetPath: '/skins/clanker_chrome_crow.png',
        description: 'Chrome mechanical crow with industrial seams.',
        visualFeature: 'Metallic sheen',
        trailStyle: 'sparks',
        price: 0.002,
        skuId: 'clanker_chrome_crow'
    },
    {
        id: 'rollup_robin',
        name: 'Rollup Robin',
        assetPath: '/skins/rollup_robin.png',
        description: 'Layered translucent plates. "Layer over layer" aesthetic.',
        visualFeature: 'Translucent layers',
        trailStyle: 'frame',
        price: 0.0035,
        skuId: 'rollup_robin'
    },
    {
        id: 'mempool_finch',
        name: 'Mempool Finch',
        assetPath: '/skins/mempool_finch.png',
        description: 'Light glitch effects, pixels trembling.',
        visualFeature: 'Glitch effect',
        trailStyle: 'noise',
        price: 0.005,
        skuId: 'mempool_finch'
    },
    {
        id: 'validator_owl',
        name: 'Validator Owl',
        assetPath: '/skins/validator_owl.png',
        description: 'Strict mask like glasses. Authoritative look.',
        visualFeature: 'Finality Crown (on record)',
        trailStyle: 'rays',
        price: 0.01,
        skuId: 'validator_owl'
    },
    {
        id: 'mev_magpie',
        name: 'MEV Magpie',
        assetPath: '/skins/mev_magpie.png',
        description: 'Mirror contour, iridescent. Sly look.',
        visualFeature: 'Reflective',
        trailStyle: 'shards',
        price: 0.1,
        skuId: 'mev_magpie'
    },
    {
        id: 'airdrop_canary',
        name: 'Airdrop Canary',
        assetPath: '/skins/airdrop_canary.png',
        description: 'Bright, festive, but minimal.',
        visualFeature: 'Tag icon',
        trailStyle: 'confetti',
        price: 1,
        skuId: 'airdrop_canary'
    },
];

export const getSkin = (id: string): Skin => {
    return SKINS.find(s => s.id === id) || SKINS[0];
};
