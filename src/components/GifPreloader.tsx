'use client';

import { useEffect, useRef } from 'react';

/**
 * Componente invisível que força o browser a baixar e decodificar o GIF
 * na primeira visita. Renderizado no layout para garantir que o GIF
 * esteja no cache do browser antes de qualquer navegação.
 */
export default function GifPreloader() {
    const ref = useRef<HTMLImageElement>(null);

    useEffect(() => {
        // Forçar decodificação do GIF para que frames estejam prontos
        if (ref.current && ref.current.decode) {
            ref.current.decode().catch(() => {});
        }
    }, []);

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            ref={ref}
            src="/img/loading.gif"
            alt=""
            aria-hidden="true"
            width={1}
            height={1}
            className="pointer-events-none fixed -top-px -left-px opacity-[0.01]"
            loading="eager"
            fetchPriority="high"
        />
    );
}
