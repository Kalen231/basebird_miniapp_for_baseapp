# Deployment Guide for Flappy Bird Frame

## 1. Prerequisites

Ensure you have the following ready:
- GitHub account (project pushed to repo).
- Vercel account.
- Supabase project URL and Anon Key.
- Farcaster Account (for domain signatures).

## 2. Deploy to Vercel

1.  Log in to [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository `flappy-bird-frame` (or whatever you named it).
4.  **Configure Project**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: `./` (default).
    *   **Environment Variables**: Expand and add the following:

| Variable Name | Value Description |
| :--- | :--- |
| `NEXT_PUBLIC_URL` | Your Vercel domain (e.g., `https://your-project.vercel.app`). **Important:** Add this AFTER the first deploy or use `https://your-project.vercel.app` if you know it. |
| `NEXT_PUBLIC_ADMIN_WALLET` | Your wallet address (admin). |
| `SUPABASE_URL` | Your Supabase Project URL. |
| `SUPABASE_ANON_KEY` | Your Supabase Anon/Public Key. |
| `NEXT_PUBLIC_WC_PROJECT_ID` | (Optional) WalletConnect Project ID for Wagmi/RainbowKit if used. |

5.  Click **Deploy**.

## 3. Post-Deployment Configuration (CRITICAL)

Farcaster Frame v2 requires a Domain Manifest with a valid signature.

1.  **Get your Domain**: Note the Vercel domain (e.g., `https://flappy-bird-awesome.vercel.app`).
2.  **Sign the Domain**:
    *   Go to [Farcaster Domain Verification Tool](https://warpcast.com/~/developers/frames) or use a script to sign the domain string `{"domain":"flappy-bird-awesome.vercel.app"}` with your Farcaster account custody address.
    *   You will get a **Signature**.
3.  **Update Code**:
    *   Open `src/app/.well-known/farcaster.json/route.ts`.
    *   Update the `accountAssociation` object:
        *   `header`: Your custody key header (base64).
        *   `payload`: Your signed payload (base64 of `{"domain":"..."}`).
        *   `signature`: The signature you generated.
4.  **Push Changes**: Commit and push. Vercel will redeploy automatically.
5.  **Update Environment Variable**: ensure `NEXT_PUBLIC_URL` in Vercel settings matches your domain exactly (no trailing slash).

## 4. Warpcast Developer Portal

1.  Go to [Warpcast Developers](https://warpcast.com/~/developers).
2.  Create a new Frame definition.
3.  Set **Frame URL** to your Vercel URL.
4.  The validator will check `/.well-known/farcaster.json`. If your signature is correct, it will pass.

## 5. Troubleshooting

-   **404 on /.well-known/farcaster.json**: Ensure the `route.ts` exists in `src/app/.well-known/farcaster.json/` and the build succeeded.
-   **Invalid Signature**: Re-check that the domain in the payload matches the actual Vercel domain exactly.
