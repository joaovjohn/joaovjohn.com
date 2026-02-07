'use client';

import { useTranslations, useLocale } from 'next-intl';
import BooksClient from './BooksClient';
import ButtonBack from '@/components/ButtonBack';

export default function BooksPage() {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <div
            className="min-h-screen relative bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: 'url(/img/wallpaper_books.jpg)' }}
        >
            {/* Dark overlay for readability */}
            <div className="fixed inset-0 bg-black/50 z-1" />

            {/* Botão Voltar - fixo no canto */}
            <div className="fixed top-10 left-10 z-20">
                <ButtonBack />
            </div>

            {/* Content Container */}
            <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
                {/* Left Side - 1/3 Free Space (hidden on mobile) */}
                <div className="hidden lg:block lg:w-1/3" />

                {/* Right Side - 2/3 Books List */}
                <div className="w-full lg:w-2/3 pt-24 lg:pt-8 pb-8">
                    {/* Content Padding */}
                    <div className="px-4 lg:px-8">
                        {/* Page Title */}
                        <header className="mb-8">
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                                {t('menu.books')}
                            </h1>
                            <p className="text-white/60">
                                {t('books.subtitle')}
                            </p>
                        </header>

                        {/* Books Client Component */}
                        <BooksClient locale={locale} />
                    </div>
                </div>
            </div>
        </div>
    );
}
