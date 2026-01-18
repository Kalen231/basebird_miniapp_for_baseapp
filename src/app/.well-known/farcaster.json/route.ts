import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // 1. Get host from request headers or env
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';

    // URL Resolution priorities:
    // 1. NEXT_PUBLIC_URL (set manually in Vercel or .env)
    // 2. Fallback to current host
    const appUrl = process.env.NEXT_PUBLIC_URL || `${protocol}://${host}`;

    const config = {
        accountAssociation: {
            header: "eyJmaWQiOjg0MDgwNywidHlwZSI6ImF1dGgiLCJrZXkiOiIweGY4ZDJiMjYwRjBjOTFlZjgwNjU5YWNGQUFBOGE4NjhDMzRkZDRkNzEifQ",
            payload: "eyJkb21haW4iOiJiYXNlYmlyZC5zcGFjZSJ9",
            signature: "LlNeC3G+mmkBwzDkuO7KwpOUUdCyZFp2J90fp36g7jJxiPWutCw2Nx8SMhEQDYy9Q5o80+F2C7ZBeN2Nq/cLoRw="
        },
        miniapp: {
            version: "1",
            name: "BaseBird",
            iconUrl: `${appUrl}/icon_new.png`,
            homeUrl: appUrl,
            imageUrl: `${appUrl}/hero_new.png`,
            buttonTitle: "Play BaseBird",
            splashImageUrl: `${appUrl}/splash_new.png`,
            splashBackgroundColor: "#0A0B14",
            // Extended Metadata
            subtitle: "Flappy Bird on Base",
            description: "Fly through pipes, earn rewards, and compete on global leaderboards in this on-chain adaptation of the classic game. Built on Base with Farcaster integration.",
            primaryCategory: "games",
            tags: ["game", "casual", "skill", "base", "bird"],
            tagline: "Fly. Survive. Earn.",
            // Visual Assets
            heroImageUrl: `${appUrl}/hero_new.png`,
            screenshotUrls: [
                `${appUrl}/screenshot_gameplay.png`,
                `${appUrl}/screenshot_gameover.png`,
                `${appUrl}/screenshot_shop.png`
            ],
            // Open Graph Sharing
            ogTitle: "BaseBird - Flappy Bird on Base",
            ogDescription: "Play BaseBird, the on-chain Flappy Bird game on Base. Compete for high scores and rewards!",
            ogImageUrl: `${appUrl}/hero_new.png`,

            webhookUrl: `${appUrl}/api/webhook`
        }
    };

    return NextResponse.json(config);
}
