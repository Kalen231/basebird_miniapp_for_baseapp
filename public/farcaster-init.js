// Farcaster Mini App Initialization Flag
// This script just sets up early flags - SDK loaded by React bundle is faster
(function () {
    if (typeof window === 'undefined') return;

    // Mark that we're initializing
    window.__FARCASTER_INIT_START__ = Date.now();

    // Check if we're in Farcaster context
    var isInIframe = window.parent !== window;
    var isReactNativeWebView = !!(window.ReactNativeWebView);

    window.__FARCASTER_CONTEXT_DETECTED__ = isInIframe || isReactNativeWebView;

    if (window.__FARCASTER_CONTEXT_DETECTED__) {
        console.log('🚀 Farcaster context detected, waiting for SDK...');
    }
})();
