import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { DiagonalMenu } from '@/components/DiagonalMenu';

export default async function HomePage() {
    const t = await getTranslations('menu');

    const menuItems = [
        { href: '/about', label: t('about') },
        { href: '/books', label: t('books') },
        { href: '/resume', label: t('resume') },
        { href: '/stoic', label: t('stoic') },
        { href: '/cool-pages', label: t('coolPages') },
        { href: '/uses', label: t('uses') },
        { href: '/projects', label: t('projects') },
    ];

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background wallpaper with next/image for performance */}
            <Image
                src="/wallpaper_menu.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
            />

            {/* Overlay escuro para melhorar legibilidade do menu */}
            <div className="absolute inset-0 bg-black/40 z-10" />

            {/* Menu diagonal posicionado à esquerda */}
            <DiagonalMenu items={menuItems} />
        </div>
    );
}
