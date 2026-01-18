import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Get host from request headers or env
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';

    // URL Resolution priorities:
    // 1. NEXT_PUBLIC_URL (set manually in Vercel or .env)
    // 2. Fallback to current host
    const appUrl = process.env.NEXT_PUBLIC_URL || `${protocol}://${host}`;

    const config = {
        accountAssociation: {
            // Domain: www.base-bird.xyz
            // These values must be regenerated via https://www.base.dev/preview?tab=account
            header: "eyJmaWQiOjMwOTg1NywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDcxNzI3ZGUyMmU1ZTlkOGJhZjBlZGFjNmYzN2RhMDMyIn0",
            payload: "eyJkb21haW4iOiJ3d3cuYmFzZS1iaXJkLnh5eiJ9",
            signature: "" // IMPORTANT: Generate new signature at https://www.base.dev/preview?tab=account
        },
        miniapp: {
            version: "1",
            name: "Base Bird",
            homeUrl: appUrl,
            iconUrl: `${appUrl}/icon_new.png`,
            splashImageUrl: `${appUrl}/splash_new.png`,
            splashBackgroundColor: "#0A0B14",
            subtitle: "Flap to earn on Base",
            description: "Base Bird is a crypto-themed Flappy Bird game built on the Base blockchain. Collect unique bird skins as NFTs, compete on the leaderboard, and earn achievements. Play, mint, and soar through the neon datastream!",
            screenshotUrls: [
                `${appUrl}/screenshot_gameplay.png`,
                `${appUrl}/screenshot_gameover.png`,
                `${appUrl}/screenshot_shop.png`
            ],
            primaryCategory: "games",
            tags: ["games", "nft", "base", "flappy", "crypto"],
            heroImageUrl: `${appUrl}/hero_new.png`,
            tagline: "Fly through the blockchain",
            ogTitle: "Base Bird - Flap to Earn on Base",
            ogDescription: "Crypto Flappy Bird game on Base. Mint unique bird skins, compete on the leaderboard, and unlock achievements!",
            ogImageUrl: `${appUrl}/hero_new.png`,
            webhookUrl: `${appUrl}/api/webhook`
        }
    };

    return NextResponse.json(config, {
        headers: {
            'Cache-Control': 'no-store, max-age=0',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
