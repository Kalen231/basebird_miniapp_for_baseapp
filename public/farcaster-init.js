// Farcaster Mini App Immediate Initialization
// This script runs BEFORE React hydrates to call ready() as fast as possible
(async function () {
    if (typeof window === 'undefined') return;

    // Check if we're likely in a Farcaster context (iframe or RN WebView)
    const isInIframe = window.parent !== window;
    const isReactNativeWebView = !!(window.ReactNativeWebView);

    if (!isInIframe && !isReactNativeWebView) {
        console.log('🖥️ Not in Farcaster context, skipping early ready()');
        return;
    }

    try {
        // Dynamically import the SDK
        const { sdk } = await import('https://esm.sh/@farcaster/miniapp-sdk@latest');

        // Call ready() immediately to hide splash screen
        await sdk.actions.ready();
        console.log('✅ sdk.actions.ready() called before React hydration');

        // Store flag so Providers.tsx knows ready was already called
        window.__FARCASTER_READY_CALLED__ = true;
    } catch (error) {
        // Not in Farcaster environment or SDK failed - this is expected for local dev
        console.log('⏭️ Early ready() skipped:', error.message);
    }
})();
