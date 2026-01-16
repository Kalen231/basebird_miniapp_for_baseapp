# Flappy Bird Frame (Farcaster Mini App)

A Flappy Bird clone built for Farcaster Frames v2 using Next.js, Tailwind CSS, and HTML5 Canvas.

## Features

-   **Game Engine**: Pure HTML5 Canvas implementation of Flappy Bird.
-   **Farcaster Integration**: Uses `@farcaster/frame-sdk` for Frame v2 compatibility.
-   **Database**: Supabase integration for storing user scores and profiles.
-   **Web3 Payments**: Base Mainnet integration via Wagmi & Viem for in-game purchases (Pay-to-Win mechanics).
-   **Responsive Design**: Mobile-first layout optimized for Farcaster client.

## Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Blockchain**: Wagmi (v2), Viem (Base Mainnet)
-   **Database**: Supabase (PostgreSQL)

## Getting Started

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env.local` file with the following variables:

    ```bash
    NEXT_PUBLIC_URL=http://localhost:3000
    NEXT_PUBLIC_ADMIN_WALLET=0xYOUR_WALLET
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_ey
    ```

3.  **Run Development Server**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

-   [Roadmap](./docs/roadmap.txt)
-   [Technical Specification](./docs/четкое%20описание%20и%20тз.txt)
