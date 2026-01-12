import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono, Press_Start_2P, Archivo_Black } from "next/font/google";
import { routing } from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import '../globals.css';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
    weight: "400",
    variable: "--font-press-start",
    subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
    weight: "400",
    variable: "--font-archivo-black",
    subsets: ["latin"],
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!routing.locales.includes(locale as 'en' | 'pt-br')) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} ${archivoBlack.variable} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    <LanguageSwitcher />
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
