import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
const appUrl = (baseUrl.startsWith("http://") || baseUrl.startsWith("https://"))
    ? baseUrl
    : `https://${baseUrl}`;

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
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
