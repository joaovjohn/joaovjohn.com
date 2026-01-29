'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function PageViewTrackerInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const gaId = process.env.NEXT_PUBLIC_GA_ID;

    useEffect(() => {
        if (!gaId || typeof window === 'undefined') return;

        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

        if (window.gtag) {
            window.gtag('config', gaId, {
                page_path: url,
            });
        }
    }, [pathname, searchParams, gaId]);

    return null;
}

export function PageViewTracker() {
    return (
        <Suspense fallback={null}>
            <PageViewTrackerInner />
        </Suspense>
    );
}

declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event' | 'js' | 'set',
            targetId: string | Date,
            config?: Record<string, unknown>
        ) => void;
    }
}
