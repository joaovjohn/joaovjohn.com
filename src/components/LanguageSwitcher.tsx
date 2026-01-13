'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="fixed top-6 right-6 z-50">
            <div className="flex gap-2 bg-white border border-cor-border rounded-full p-1 shadow-md">
                <button
                    onClick={() => handleLanguageChange('pt-br')}
                    className={`px-4 py-2 cursor-pointer rounded-full transition-all duration-300 ${
                        locale === 'pt-br'
                            ? 'bg-cor-1 text-white font-semibold'
                            : 'text-cor-1-lighter hover:text-cor-1'
                    }`}
                    aria-label="Português"
                >
                    PT
                </button>
                <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-4 py-2 cursor-pointer rounded-full transition-all duration-300 ${
                        locale === 'en'
                            ? 'bg-cor-1 text-white font-semibold'
                            : 'text-cor-1-lighter hover:text-cor-1'
                    }`}
                    aria-label="English"
                >
                    EN
                </button>
            </div>
        </div>
    );
}
