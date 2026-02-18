'use client';

import { useEffect, useState, type ReactNode } from 'react';

/** Cache de imagens já carregadas — persiste entre re-mounts (troca de locale). */
const loadedImages = new Set<string>();

interface PageRevealProps {
    backgroundSrc: string;
    children: ReactNode;
}

/**
 * Mostra o conteúdo imediatamente (wallpaper carrega progressivamente)
 * e exibe o GIF de loading até o wallpaper estar 100% pronto.
 */
export default function PageReveal({ backgroundSrc, children }: PageRevealProps) {
    const [ready, setReady] = useState(loadedImages.has(backgroundSrc));

    useEffect(() => {
        if (ready) return;

        const bg = new window.Image();
        bg.src = backgroundSrc;

        const done = () => {
            loadedImages.add(backgroundSrc);
            setReady(true);
        };

        if (bg.complete) done();
        else {
            bg.onload = done;
            bg.onerror = done;
        }
    }, [backgroundSrc, ready]);

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
