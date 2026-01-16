import { NextResponse } from 'next/server';

export async function GET() {
    // Use NEXT_PUBLIC_URL or fallback to production domain
    const appUrl = process.env.NEXT_PUBLIC_URL || 'https://basebird.space';

    const config = {
        accountAssociation: {
            header: "eyJmaWQiOjg0MDgwNywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEExQjgyYkQxOEUxNThjMUZGNkI3Nzc4NjgwNTc0Y2YyMUNmQTIzNTMifQ",
            payload: "eyJkb21haW4iOiJiYXNlYmlyZC5zcGFjZSJ9",
            signature: "/UnZosrcjJ7Nrjj6q4AAwfZQe1I/Yj7k62bL0j8eaOt9oukPmSxpUNUIVUkErBLQO8ybtg1+MyEZjD2e1nO0Ths="
        },
        miniapp: {
            version: "1",
            name: "BaseBird",
            iconUrl: `${appUrl}/icon.png`,
            homeUrl: appUrl,
            imageUrl: `${appUrl}/splash.png`,
            buttonTitle: "Play BaseBird",
            splashImageUrl: `${appUrl}/splash.png`,
            splashBackgroundColor: "#70c5ce",
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
