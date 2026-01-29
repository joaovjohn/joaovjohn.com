'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import clarity from '@microsoft/clarity';

function MicrosoftClarityInner() {
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!clarityId) return;
        
        clarity.init(clarityId);
    }, [clarityId]);

    useEffect(() => {
        if (!clarityId || typeof window === 'undefined') return;

        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
        
        if (window.clarity) {
            window.clarity('set', 'page', url);
        }
    }, [pathname, searchParams, clarityId]);

    return null;
}

export function MicrosoftClarity() {
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

    if (!clarityId) {
        return null;
    }

    return (
        <Suspense fallback={null}>
            <MicrosoftClarityInner />
        </Suspense>
    );
}

declare global {
    interface Window {
        clarity: (action: string, ...args: unknown[]) => void;
    }
}
