import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics, MicrosoftClarity, PageViewTracker } from '@/components/monitoring';

export const metadata: Metadata = {
    title: {
        template: '%s | João Vitor John (joaovjohn)',
        default: 'João Vitor John (joaovjohn) | Desenvolvedor Full Stack', // Título da Home
    },
    description: 'Portfólio de João Vitor John. Desenvolvedor de software especializado em desenvolvimento web, PHP e Node.js.',
    keywords: [
        "Portifólio Bomba Patch",
        "Página Bomba Patch",
        "João Vitor John",
        "Joao Vitor John",
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
        description: 'Confira meu portfólio e projetos.',
        url: 'https://joaovjohn.com',
        siteName: 'João Vitor John',
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
