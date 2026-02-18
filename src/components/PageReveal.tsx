'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useNavigationLoader } from '@/contexts/NavigationLoaderContext';

interface PageRevealProps {
    backgroundSrc: string;
    children: ReactNode;
}

/**
 * Renderiza children imediatamente. Exibe GIF de loading apenas
 * no primeiro acesso direto (URL) até o wallpaper carregar.
 * Na navegação interna, sinaliza ao NavigationLoader que a página está pronta.
 */
export default function PageReveal({ backgroundSrc, children }: PageRevealProps) {
    const { stopLoading } = useNavigationLoader();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const bg = new window.Image();
        bg.src = backgroundSrc;

        const done = () => { setReady(true); stopLoading(); };

        if (bg.complete) { done(); return; }

        bg.onload = done;
        bg.onerror = done;
    }, [backgroundSrc, stopLoading]);

    return (
        <>
            {children}
            {!ready && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src="/img/loading.gif"
                    alt=""
                    aria-hidden="true"
                    width={130}
                    height={130}
                    className="fixed bottom-12 left-24 z-[99999] pointer-events-none select-none object-contain"
                />
            )}
        </>
    );
}
