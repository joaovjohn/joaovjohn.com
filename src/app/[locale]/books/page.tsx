import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { bookService } from '@/services/book.service';
import BooksClient from './BooksClient';
import ButtonBack from '@/components/ButtonBack';
import PageReveal from '@/components/PageReveal';

export default async function BooksPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations();
    const validLocale = (locale === 'pt-br' || locale === 'en') ? locale : 'pt-br';
    const books = await bookService.getBooks(validLocale);

    return (
        <PageReveal backgroundSrc="/img/wallpaper_books.jpg">
            <div className="min-h-screen relative">
                {/* Background Image - fixed, server-rendered com priority */}
                <div className="fixed inset-0 z-0">
                    <Image 
                        src="/img/wallpaper_books.jpg"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                </div>

                {/* Overlay escuro para legibilidade */}
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

                            {/* Books Client Component - dados já carregados do servidor */}
                            <BooksClient books={books} />
                        </div>
                    </div>
                </div>
            </div>
        </PageReveal>
    );
}
