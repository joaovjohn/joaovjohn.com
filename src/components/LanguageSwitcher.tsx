'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleLanguageChange = (newLocale: 'en' | 'pt-br') => {
        startTransition(() => {
            router.replace(pathname, { locale: newLocale });
        });
    };

    return (
        <div className="fixed top-6 right-6 z-50">
            <div className={`flex gap-2 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full p-1 shadow-md transition-opacity ${isPending ? 'opacity-70' : ''}`}>
                <button
                    onClick={() => handleLanguageChange('pt-br')}
                    disabled={isPending}
                    className={`px-4 py-2 cursor-pointer rounded-full transition-all duration-300 ${
                        locale === 'pt-br'
                            ? 'bg-white text-black font-semibold'
                            : 'text-white/60 hover:text-white'
                    } ${isPending ? 'cursor-wait' : ''}`}
                    aria-label="Português"
                >
                    PT
                </button>
                <button
                    onClick={() => handleLanguageChange('en')}
                    disabled={isPending}
                    className={`px-4 py-2 cursor-pointer rounded-full transition-all duration-300 ${
                        locale === 'en'
                            ? 'bg-white text-black font-semibold'
                            : 'text-white/60 hover:text-white'
                    } ${isPending ? 'cursor-wait' : ''}`}
                    aria-label="English"
                >
                    EN
                </button>
            </div>
        </div>
    );
}
