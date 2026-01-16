import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

const appUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

const miniappEmbed = {
    version: "1",
    imageUrl: `${appUrl}/splash.png`,
    button: {
        title: "Play BaseBird",
        action: {
            type: "launch_miniapp",
            name: "BaseBird",
            url: appUrl,
            splashImageUrl: `${appUrl}/splash.png`,
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
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
