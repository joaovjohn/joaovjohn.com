'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { useRouter } from '@/i18n/navigation';

/** Mapa de rotas → wallpaper. Rotas sem wallpaper navegam instantaneamente. */
const WALLPAPERS: Record<string, string> = {
    '/': '/img/wallpaper_menu.jpg',
    '/books': '/img/wallpaper_books.jpg',
    '/stoic': '/img/wallpaper_stoic.png',
};

/** Cache de wallpapers já carregados no browser. */
const preloaded = new Set<string>();

interface NavigationLoaderCtx {
    navigateTo: (href: string) => void;
    stopLoading: () => void;
    isLoading: boolean;
}

const Ctx = createContext<NavigationLoaderCtx>({ navigateTo: () => {}, stopLoading: () => {}, isLoading: false });

export const useNavigationLoader = () => useContext(Ctx);

export function NavigationLoaderProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const stopLoading = useCallback(() => setIsLoading(false), []);

    const navigateTo = useCallback((href: string) => {
        const wallpaper = WALLPAPERS[href];

        // Sem wallpaper ou já cacheado → navega direto
        if (!wallpaper || preloaded.has(wallpaper)) {
            router.push(href);
            return;
        }

        setIsLoading(true);

        const img = new window.Image();
        img.src = wallpaper;

        const go = () => {
            preloaded.add(wallpaper);
            router.push(href);
            // NÃO para o loading aqui — PageReveal da página destino chama stopLoading
        };

        if (img.complete) go();
        else {
            img.onload = go;
            img.onerror = go;
        }
    }, [router]);

    return (
        <Ctx.Provider value={{ navigateTo, stopLoading, isLoading }}>
            {children}
            {isLoading && (
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
        </Ctx.Provider>
    );
}
