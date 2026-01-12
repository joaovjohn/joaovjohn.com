import { getTranslations } from 'next-intl/server';
// import DiagonalMenu from '@/components/DiagonalMenu';
import { pages } from '@/contracts/types/TPages';

export default async function HomePage() {
    const t = await getTranslations();

    const menuItems = [
        { href: '/about', label: t('about') },
        { href: '/stoic', label: t('stoic') },
    ];

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-page">
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <h1 className="text-6xl md:text-8xl font-bold mb-4 text-cor-1">
                        {t('joaovjohn')}
                    </h1>
                </div>

                {/* <DiagonalMenu items={menuItems} /> */}
            </div>

            {/* Grid overlay for visual effect */}
            <div 
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
                        linear-gradient(var(--cor-border) 1px, transparent 1px),
                        linear-gradient(90deg, var(--cor-border) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}
            />
        </div>
    );
}
