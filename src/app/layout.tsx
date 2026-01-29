import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics, MicrosoftClarity, PageViewTracker } from '@/components/monitoring';

export const metadata: Metadata = {
    title: "João Vitor John",
    keywords: [
        "Bomba Patch",
        "Portifólio Bomba Patch",
        "Página Bomba Patch",
        "João Vitor John",
        "Portfolio",
        "Desenvolvedor Full-Stack"
    ],
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
