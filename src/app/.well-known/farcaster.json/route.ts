import { NextResponse } from 'next/server';

export async function GET() {
    // URL Resolution priorities:
    // 1. NEXT_PUBLIC_URL (set manually in Vercel or .env)
    // 2. VERCEL_PROJECT_PRODUCTION_URL (Auto-set by Vercel for production deployments)
    // 3. VERCEL_URL (Auto-set by Vercel for preview/dev - often lacks https://)
    // 4. Hardcoded fallback

    let appUrl = process.env.NEXT_PUBLIC_URL;

    if (!appUrl) {
        if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
            appUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
        } else {
            appUrl = 'https://basebird.space';
        }
    } else if (appUrl.includes('localhost')) {
        // Force production URL if localhost is detected in NEXT_PUBLIC_URL
        appUrl = 'https://basebird.space';
    }

    // Ensure no trailing slash
    appUrl = appUrl.replace(/\/$/, '');

    // Force HTTPS if not localhost
    if (!appUrl.startsWith('http://localhost') && !appUrl.startsWith('https://')) {
        appUrl = appUrl.replace('http://', 'https://');
    }

    const config = {
        accountAssociation: {
            header: "eyJmaWQiOjg0MDgwNywidHlwZSI6ImF1dGgiLCJrZXkiOiIweGY4ZDJiMjYwRjBjOTFlZjgwNjU5YWNGQUFBOGE4NjhDMzRkZDRkNzEifQ",
            payload: "eyJkb21haW4iOiJiYXNlYmlyZC5zcGFjZSJ9",
            signature: "LlNeC3G+mmkBwzDkuO7KwpOUUdCyZFp2J90fp36g7jJxiPWutCw2Nx8SMhEQDYy9Q5o80+F2C7ZBeN2Nq/cLoRw="
        },
        miniapp: {
            version: "1",
            name: "BaseBird",
            iconUrl: `${appUrl}/icon.png`,
            homeUrl: appUrl,
            imageUrl: `${appUrl}/hero_image.png`,
            buttonTitle: "Play BaseBird",
            splashImageUrl: `${appUrl}/icon.png`,
            splashBackgroundColor: "#000000",
            heroImageUrl: `${appUrl}/hero_image.png`,
            screenshotUrls: [
                `${appUrl}/screenshot_gameplay.png`,
                `${appUrl}/screenshot_gameover.png`,
                `${appUrl}/screenshot_shop.png`
            ],
            webhookUrl: `${appUrl}/api/webhook`
        }
    };

    return NextResponse.json(config);
}
