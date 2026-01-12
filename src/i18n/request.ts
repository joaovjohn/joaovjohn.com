import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as 'en' | 'pt-br')) {
        locale = routing.defaultLocale;
    }

    return {
        locale: locale as string,
        messages: (await import(`../../dictionaries/${locale}.json`)).default
    };
});
