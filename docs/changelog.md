# Changelog

## [2026-01-16] Farcaster Mini App SDK Migration
- **SDK**: Migrated from `@farcaster/frame-sdk` (deprecated) to `@farcaster/miniapp-sdk` (current).
- **Wagmi**: Updated connector from `injected()` to `@farcaster/miniapp-wagmi-connector` for proper Farcaster wallet integration.
- **Manifest**: Changed manifest config key from `frame` to `miniapp` as per current spec.
- **Layout**: Added `fc:miniapp` meta tag for proper embed display in Farcaster feeds.
- **Providers**: Rewrote SDK initialization with proper `sdk.actions.ready()` call to hide splash screen.
- **Build**: Verified production build success.

## [2026-01-16] Pre-Deployment Prep
- **Config**: Converted `farcaster.json` to a dynamic API route (`src/app/.well-known/farcaster.json/route.ts`) to support `NEXT_PUBLIC_URL` env var.
- **Build**: Verified production build success.
- **Docs**: Added `docs/DEPLOYMENT.md` with step-by-step Vercel instructions.

## [2026-01-16] Step 6: Polish & Assets
- **Assets**: Created SVG sprites for Bird, Pipes, and Background in `public/`.
- **Game Engine**: Updated `GameCanvas.tsx` to render images instead of colored rects.
- **UI**: Added "Share" button to Game Over screen utilizing `sdk.actions.openUrl`.
- **Polish**: Improved visual presentation with dedicated SVG graphics.

## [2026-01-16] Optimization & GitHub Prep
- **Cleanup**: Removed usage of `test_api.js` and redundant folders.
- **Config**: Standardized `.well-known` location to `public/` and fixed port to 3000.
- **Docs**: Added `README.md` and `.gitignore` for repository initialization.
- **Structure**: Optimized project file structure for cleaner deployment.
