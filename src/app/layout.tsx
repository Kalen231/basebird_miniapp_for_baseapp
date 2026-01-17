import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

import DebugMonitor from "@/components/DebugMonitor";

const inter = Inter({ subsets: ["latin"] });

function getAppUrl() {
    if (process.env.NEXT_PUBLIC_URL && !process.env.NEXT_PUBLIC_URL.includes('localhost')) {
        return process.env.NEXT_PUBLIC_URL;
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "https://basebird.space";
}

const appUrl = getAppUrl();

const miniappEmbed = {
    version: "1",
    imageUrl: `${appUrl}/hero_image.png`,
    button: {
        title: "Play BaseBird",
        action: {
            type: "launch_miniapp",
            name: "BaseBird",
            url: appUrl,
            splashImageUrl: `${appUrl}/icon.png`,
            splashBackgroundColor: "#000000"
        }
    }
};

export const metadata: Metadata = {
    title: "BaseBird - Farcaster Mini App",
    description: "A Farcaster BaseBird Mini App",
    other: {
        "fc:miniapp": JSON.stringify(miniappEmbed),
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <DebugMonitor />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
