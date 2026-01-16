import { NextResponse } from 'next/server';

export async function GET() {
    // Use NEXT_PUBLIC_URL or fallback to production domain
    const appUrl = 'https://basebird.space';

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
