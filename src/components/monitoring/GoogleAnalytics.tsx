import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

/**
 * Google Analytics component using the official Next.js third-parties package.
 * This provides optimal loading performance and automatic pageview tracking.
 * 
 * @requires NEXT_PUBLIC_GA_ID environment variable
 */
export function GoogleAnalytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;

    if (!gaId) {
        return null;
    }

    return <NextGoogleAnalytics gaId={gaId} />;
}
