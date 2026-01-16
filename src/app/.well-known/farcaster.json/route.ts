import { NextResponse } from 'next/server';

export async function GET() {
    const appUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const config = {
        accountAssociation: {
            header: "eyJmaWQiOjM2MjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgyY2Q4NWEwOTMyNjFmNTkyNzA4MDRBNkVBNjk3Q2VBNENlQkVjYWZFIn0",
            payload: "eyJkb21haW4iOiJleGFtcGxlLmNvbSJ9", // TODO: Update with actual domain payload after deployment
            signature: "MHgyY2Q4NWEwOTMyNjFmNTkyNzA4MDRBNkVBNjk3Q2VBNENlQkVjYWZF" // TODO: Update with actual signature after deployment
        },
        miniapp: {
            version: "1",
            name: "BaseBird",
            iconUrl: `${appUrl}/icon.png`,
            homeUrl: appUrl,
            imageUrl: `${appUrl}/splash.png`,
            buttonTitle: "Play BaseBird",
            splashImageUrl: `${appUrl}/splash.png`,
            splashBackgroundColor: "#000000",
            webhookUrl: `${appUrl}/api/webhook`
        }
    };

    return NextResponse.json(config);
}
