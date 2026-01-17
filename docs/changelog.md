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

## [2026-01-16] Farcaster Manifest Assets & Images
- **Assets**: Generated and added `hero_image.png`, `screenshot_gameplay.png`, `screenshot_gameover.png`, and `screenshot_shop.png` to `public/`.
- **Manifest**: Updated `src/app/.well-known/farcaster.json/route.ts` with required Farcaster Mini App fields: `heroImageUrl`, `screenshotUrls`, and `splashBackgroundColor`.
- **Branding**: Set splash background color to `#70c5ce` to match the game's sky theme.

## [2026-01-16] Manifest & Embed Fixes
- **Embed**: Updated `src/app/layout.tsx` to handle `NEXT_PUBLIC_URL` robustness (forcing HTTPS) and fixed image references (`imageUrl` -> `hero_image.png`, `splashImageUrl` -> `icon.png`).
- **Manifest**: Synchronized `src/app/.well-known/farcaster.json/route.ts` with correct image references and formatting.
- **Fix**: Resolved "Invalid URL" and aspect ratio issues reported in Embed Tool.

## [2026-01-17] Crypto Bird Skins Integration
- **Assets**: Created 12 unique crypto-themed bird skins (PNG) in `public/skins/`.
- **Config**: Added `src/config/skins.ts` registry to manage skin metadata, pricing, and visual features.
- **Engine**: Updated `GameCanvas.tsx` to dynamically load skin assets based on the `activeSkin` prop.
- **Structure**: Verified asset paths and integration with the game loop.

## [2026-01-17] Skin Transparency Fix
- **Assets**: Processed all 8 bird skins in `public/skins/` to remove background colors (transparency fix).
- **Tooling**: Used `jimp` script for batch processing to ensure clean transparency.

## [2026-01-17] Shop Integration - All Bird Skins
- **Shop**: Refactored `ShopModal.tsx` to dynamically display all 8 crypto bird skins from config.
- **Pricing**: Configured ETH prices for all skins:
  - Base Blue Jay: 0.0001 ETH (mintable, only gas)
  - Solana Neon Swallow: 0.001 ETH
  - Clanker Chrome Crow: 0.002 ETH
  - Rollup Robin: 0.0035 ETH
  - Mempool Finch: 0.005 ETH
  - Validator Owl: 0.01 ETH
  - MEV Magpie: 0.1 ETH
  - Airdrop Canary: 1 ETH
- **Config**: Updated `skins.ts` with `isMintable` flag for base bird and `skuId` for all skins.
- **Inventory**: Refactored `InventoryModal.tsx` to use shared skins config with actual bird images.
- **State**: Updated `page.tsx` to handle empty initial inventory (users must mint/buy first).

### 2026-01-17 Achievements System Integration
- **Features**: Added "First Flight" and "Recast" achievements.
- **Database**: Added `achievements` table and `games_played` tracking.
- **API**: Implemented `/api/achievements/*` endpoints for listing, unlocking, and minting.
- **UI**: Added Achievements Modal and Menu button.
- **Assets**: Added SVG placeholders for achievement icons.

## [2026-01-17] Codebase Optimization & Refactoring
- **Structure**: Created centralized `src/types/` for TypeScript interfaces and `src/config/` for game constants.
- **Hooks**: Extracted data fetching logic (sync, achievements) into `src/hooks/useGameData.ts`.
- **Refactor**: Cleaned up `GameCanvas.tsx` and `page.tsx` by removing hardcoded values and inline types.
- **Verification**: Verified build success ensuring no regressions.

## [2026-01-17] Farcaster Mini App Loading Fixes
- **Critical Fix**: Updated Providers.tsx to remove aggressive iframe detection that was blocking sdk.actions.ready() in some environments. Added robust fallback timeout to ensure app always initializes.
- **Environment**: Updated src/app/layout.tsx to dynamically use NEXT_PUBLIC_URL for the embed URL, ensuring Vercel deployments point to the correct domain instead of hardcoded  asebird.space.
- **Stability**: These changes resolve the 'Ready not called' error and splash screen hang issues reported by the user.

## [2026-01-17] Visual Redesign - "Neon Datastream" Theme
- **Theme**: Complete visual overhaul from classic Flappy Bird to dark crypto-futuristic aesthetic.
- **Background**: New `background_new.svg` with dark gradient (#0A0B14 to #111827), grid pattern, data streams, network nodes, and digital cityscape.
- **Pipes**: New `pipe_body_new.svg` and `pipe_cap_new.svg` as "Glass Pillars" with semi-transparent dark fill and neon cyan (#00D4FF) glow edges.
- **UI**: Updated game container with dark background, cyan glow border, and holographic score display.
- **Colors**: Adopted Base blockchain color palette (Base Blue #0052FF, Neon Cyan #00D4FF, Deep Void #0A0B14).
- **Note**: Bird skins remain unchanged as per design requirements.

## [2026-01-17] Fix - Persistent "No Bird" Warning
- **Logic**: Implemented `hasInitialized` state in `useGameData` to accurately track first data sync completion.
- **UI**: Updated `MainMenu` to disable the "Play" button and show "LOADING..." until user data (birds) is fully loaded.
- **Fix**: Prevents the "You need a bird!" modal from appearing incorrectly when reloading the game, ensuring users can only play after their inventory is verified.

## [2026-01-17] Recast Achievement & Share Logic
- **Achievements**: Added "Share" button logic to `AchievementsModal` for the "Recast" achievement.
- **Verification**: Implemented `sdk.actions.composeCast` integration to open Farcaster composer and detect successful casting for immediate achievement unlocking.
- **UX**: User can now share the game and instantly unlock/mint the achievement without leaving the flow (or with minimal friction).

## [2026-01-17] Shop UX Improvements
- **Shop**: Suppressed error popup when user cancels a buy/mint transaction.
- **Achievements**: Suppressed similar error popup for achievement minting cancellations.
- **Fix**: Prevents "User rejected the request" errors from being shown to the user as a failure, improving the user experience.
- **Debug**: Disabled auto-showing of debug overlay on errors for production builds; overlay now requires `?debug=true`.

## [2026-01-17] Polish - Bird Trail Alignment
- **Visuals**: Adjusted the particle spawn position for the default "blocks" trail style. Particles now emanate from within the bird sprite (x+20) rather than spawning detached behind it (x-5), creating a more cohesive visual effect that connects the trail to the bird as requested.

## [2026-01-17] Database Fix - Cascade Deletes
- **Schema**: Updated `docs/supabase_schema.sql` to include `ON DELETE CASCADE` for **both** `achievements` and `purchases` tables.
- **Fix**: This resolves the "Unable to delete row" error when removing a user, ensuring all related data is automatically cleaned up.

## [2026-01-17] Polish - Play Again Button
- **UI**: Redesigned the "Play Again" button in the Game Over menu to be a circular, centered icon button.
- **UX**: Moved the button "higher" (closer to score, separated from bottom menu) and updated its position to prevent accidental clicks after game over.
