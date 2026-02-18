'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Cache de imagens carregadas — persiste entre re-mounts (troca de locale, etc).
 * Garante que a troca de idioma não re-exiba o overlay.
 */
const loadedImages = new Set<string>();

interface PageRevealProps {
    backgroundSrc: string;
    children: ReactNode;
}

/**
 * Exibe GIF de loading em fundo preto até a imagem de background da página
 * estar 100% carregada. Se a imagem já está em cache (troca de locale,
 * navegação de volta), renderiza conteúdo instantaneamente sem overlay.
 */
export default function PageReveal({ backgroundSrc, children }: PageRevealProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const cached = loadedImages.has(backgroundSrc);
    const [revealed, setRevealed] = useState(cached);

    useEffect(() => {
        if (revealed) return;

        // 1. Montar GIF no overlay via DOM (garante renderização)
        const gif = document.createElement('img');
        gif.src = '/img/loading.gif';
        gif.width = 130;
        gif.height = 130;
        gif.style.cssText = 'position:absolute;bottom:3rem;left:6rem;object-fit:contain;pointer-events:none;user-select:none;';
        gif.setAttribute('aria-hidden', 'true');
        gif.alt = '';

        if (overlayRef.current) {
            overlayRef.current.appendChild(gif);
        }

        // 2. Aguardar imagem de fundo carregar
        const bg = new window.Image();
        bg.src = backgroundSrc;

        const reveal = () => {
            loadedImages.add(backgroundSrc);
            setRevealed(true);
        };

        if (bg.complete) {
            reveal();
        } else {
            bg.onload = reveal;
            bg.onerror = reveal;
        }

        return () => { gif.remove(); };
    }, [backgroundSrc, revealed]);

    // Imagem já em cache → renderiza diretamente, sem overlay nem fade
    if (cached) {
        return <>{children}</>;
    }

    return (
        <>
            {!revealed && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 bg-black"
                    style={{ zIndex: 99999 }}
                />
            )}
            <div className={revealed ? 'animate-fade-in' : 'invisible'}>
                {children}
            </div>
        </>
    );
}
