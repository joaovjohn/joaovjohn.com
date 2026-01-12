import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "João Vitor John",
    description: "Portfolio e espaço digital de João Vitor John",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return children;
}
