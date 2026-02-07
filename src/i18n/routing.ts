import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'pt-br'],

    // Used when no locale matches
    defaultLocale: 'pt-br',

    // Don't add locale prefix to default locale
    localePrefix: 'as-needed'
});
