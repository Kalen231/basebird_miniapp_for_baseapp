import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Get host from request headers or env
    const host = request.headers.get('host');
    const isLocalhost = host?.includes('localhost');

    // URL Resolution priorities:
    // 1. NEXT_PUBLIC_URL (set manually in Vercel or .env)
    // 2. Fallback to current host
    let appUrl = process.env.NEXT_PUBLIC_URL || host || 'www.base-bird.xyz';

    // Ensure URL has proper protocol
    if (!appUrl.startsWith('http://') && !appUrl.startsWith('https://')) {
        appUrl = isLocalhost ? `http://${appUrl}` : `https://${appUrl}`;
    }

    const config = {
        accountAssociation: {
            "header": "eyJmaWQiOjE4ODc2ODcsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgzMUI0NmU3ODdiM2UxYUE0Mjg2MjQyMTI5RmYwOTE4MjdjN2RDYmRiIn0",
            "payload": "eyJkb21haW4iOiJ3d3cuYmFzZS1iaXJkLnh5eiJ9",
            "signature": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEGIfA88gDVvciIyiCs5X3rzy5VucsT_-8KFGQ2eI_XjkDVdbF0eW6OGUIPeWvMvPoc0nIjBibEehY5OHmnK05b7GwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
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
