import Image from 'next/image';
import { stoicService } from '@/services/stoic.service';
import ButtonBack from '@/components/ButtonBack';
import StoicClient from './StoicClient';

export default async function StoicPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const validLocale = (locale === 'pt-br' || locale === 'en') ? locale : 'en';
    const allQuotes = await stoicService.getQuotes(validLocale);
    const dailyQuotes = stoicService.getDailyQuotes(allQuotes);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Wallpaper - server-rendered com priority */}
            <Image 
                src="/img/wallpaper_stoic.png" 
                alt="" 
                fill 
                className="object-cover"
                priority
                sizes="100vw"
            />

            {/* Overlay escuro para legibilidade */}
            <div className="absolute inset-0 bg-black/40 z-[1]" />

            {/* Botão Voltar */}
            <div className="absolute top-10 left-10 z-20">
                <ButtonBack />
            </div>

            {/* Conteúdo interativo - client side */}
            <StoicClient quotes={dailyQuotes} />
        </div>
    );
}
