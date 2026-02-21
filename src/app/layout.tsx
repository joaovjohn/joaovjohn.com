import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics, MicrosoftClarity, PageViewTracker } from '@/components/monitoring';

export const metadata: Metadata = {
    title: {
        template: '%s | João Vitor John (joaovjohn)',
        default: 'João Vitor John - Fullstack Developer', 
    },
    description: 'Página legalzinha para se enterter as vezes',
    keywords: [
        "Portifólio Bomba Patch",
        "Página Bomba Patch",
        "João Vitor John",
        "Joao Vitor John",
        "joao vitor john",
        "Joao Vitor Klein John",
        "joaovjohn",
        "Portfolio",
        "Desenvolvedor Full-Stack"
    ],
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: 'João Vitor John - Desenvolvedor',
        description: 'Página legalzinha para se enterter as vezes',
        url: 'https://joaovjohn.com',
        siteName: 'Joao Vitor John',
        locale: 'pt_BR',
        type: 'website',
    },
    metadataBase: new URL("https://joaovjohn.com")
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <>
            <GoogleAnalytics />
            {children}
            <MicrosoftClarity />
            <PageViewTracker />
            <Analytics />
        </>
    );
}
