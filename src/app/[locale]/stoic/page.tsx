'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { stoicService } from '@/services/stoic.service';
import ButtonDefault from '@/components/ButtonDefault';
import { useAudio } from '@/contexts/AudioContext';
import { useRouter } from '@/i18n/routing';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Quote {
    text: string;
    author: string;
}

export default function StoicPage() {
    const locale = useLocale();
    const t = useTranslations();
    const router = useRouter();
    const { sfxVolume } = useAudio();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [current, setCurrent] = useState(0);
    const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Helper para tocar efeitos sonoros
    const playSfx = (file: string) => {
        try {
            const audio = new Audio(`/audio/${file}`);
            audio.volume = sfxVolume;
            audio.play().catch((e) => console.warn('SFX play failed', e));
        } catch (e) {
            console.error('Audio setup failed', e);
        }
    };

    // Handler para o botão voltar
    const handleBack = () => {
        playSfx('back.mp3');
        router.push('/');
    };

    useEffect(() => {
        const loadQuotes = async () => {
            setIsLoadingQuotes(true);
            const validLocale = (locale === 'pt-br' || locale === 'en') ? locale : 'en';
            const allQuotes = await stoicService.getQuotes(validLocale);
            const dailyQuotes = stoicService.getDailyQuotes(allQuotes);
            setQuotes(dailyQuotes);
            
            const savedIndex = sessionStorage.getItem('stoicIndex');
            if (savedIndex) {
                const index = parseInt(savedIndex);
                if (!isNaN(index) && index >= 0 && index < dailyQuotes.length) {
                    setCurrent(index);
                }
            } else {
                setCurrent(0);
            }
            
            setIsLoadingQuotes(false);
        };
        loadQuotes();
    }, [locale]);

    useEffect(() => {
        if (!isLoadingQuotes) {
            sessionStorage.setItem('stoicIndex', current.toString());
        }
    }, [current, isLoadingQuotes]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
    
        if (isLeftSwipe && current < quotes.length - 1) {
            playSfx('switch.mp3');
            setCurrent(current + 1);
        }
        if (isRightSwipe && current > 0) {
            playSfx('switch.mp3');
            setCurrent(current - 1);
        }
    };

    const handlePrev = () => {
        playSfx('switch.mp3');
        if (current > 0) setCurrent(current - 1);
    };

    const handleNext = () => {
        playSfx('switch.mp3');
        if (current < quotes.length - 1) setCurrent(current + 1);
    };

    if (isLoadingQuotes) {
        return (
            <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
                <Image 
                    src="/img/wallpaper_stoic.png" 
                    alt="Stoic Background" 
                    fill 
                    className="object-cover"
                    priority
                />
                <div className="relative z-10 text-white text-xl font-light backdrop-blur-sm px-6 py-3 rounded-lg bg-black/30">
                    {t('loading')}
                </div>
            </div>
        );
    }

    const quote = quotes[current];

    return (
        <div 
            className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Background Wallpaper */}
            <Image 
                src="/img/wallpaper_stoic.png" 
                alt="Stoic Background" 
                fill 
                className="object-cover"
                priority
            />

            {/* Overlay escuro para legibilidade */}
            <div className="absolute inset-0 bg-black/40 z-1" />

            {/* Botão Voltar - Estilo ButtonDefault com sons */}
            <div className="absolute top-6 left-6 z-20">
                <ButtonDefault
                    variant="default"
                    size="sm"
                    onClick={handleBack}
                    onMouseEnter={() => playSfx('hover.mp3')}
                >
                    ← {t('back')}
                </ButtonDefault>
            </div>

            {/* Container principal com navegação */}
            <div className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-4">
                
                {/* Botão Anterior - Amarelo piscando */}
                <div className="hidden md:flex items-center justify-center w-14 h-14">
                    {current > 0 && (
                        <button
                            onClick={handlePrev}
                            className="w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:shadow-[0_0_30px_rgba(250,204,21,0.8)] transition-all duration-300 cursor-pointer"
                            aria-label="Previous quote"
                        >
                            <FaChevronLeft className="text-xl" />
                        </button>
                    )}
                </div>

                {/* Card da Citação */}
                <div className="flex-1 backdrop-blur-md bg-black/50 p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
                    <blockquote className="text-center">
                        <p className="text-2xl md:text-4xl text-white font-light mb-8 leading-relaxed tracking-wide drop-shadow-md">
                            &ldquo;{quote.text}&rdquo;
                        </p>
                        <footer className="text-lg md:text-xl text-yellow-400 font-medium tracking-widest uppercase opacity-90">
                            — {quote.author}
                        </footer>
                    </blockquote>
                </div>

                {/* Botão Próximo - Amarelo piscando */}
                <div className="hidden md:flex items-center justify-center w-14 h-14">
                    {current < quotes.length - 1 && (
                        <button
                            onClick={handleNext}
                            className="w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:shadow-[0_0_30px_rgba(250,204,21,0.8)] transition-all duration-300 cursor-pointer"
                            aria-label="Next quote"
                        >
                            <FaChevronRight className="text-xl" />
                        </button>
                    )}
                </div>
            </div>

            {/* Indicadores de paginação */}
            <div className="relative z-10 flex justify-center gap-3 mt-12">
                {quotes.map((_, i: number) => (
                    <button
                        key={i}
                        onClick={() => {
                            playSfx('switch.mp3');
                            setCurrent(i);
                        }}
                        className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                            i === current 
                                ? 'bg-yellow-400 w-10 shadow-[0_0_12px_rgba(250,204,21,0.8)]' 
                                : 'bg-white/30 w-2 hover:bg-white/60'
                        }`}
                        aria-label={`Go to quote ${i + 1}`}
                    />
                ))}
            </div>
            
            {/* Navegação Mobile - Botões nas laterais (visíveis apenas em telas pequenas) */}
            <div className="md:hidden flex justify-between w-full absolute top-1/2 -translate-y-1/2 px-2 z-10 pointer-events-none">
                {current > 0 && (
                    <button 
                        className="w-10 h-10 bg-yellow-400/80 rounded-full flex items-center justify-center animate-pulse pointer-events-auto cursor-pointer shadow-lg"
                        onClick={handlePrev}
                        aria-label="Previous quote"
                    >
                        <FaChevronLeft className="text-black text-lg" />
                    </button>
                )}
                <div className="flex-1" />
                {current < quotes.length - 1 && (
                    <button 
                        className="w-10 h-10 bg-yellow-400/80 rounded-full flex items-center justify-center animate-pulse pointer-events-auto cursor-pointer shadow-lg"
                        onClick={handleNext}
                        aria-label="Next quote"
                    >
                        <FaChevronRight className="text-black text-lg" />
                    </button>
                )}
            </div>
        </div>
    );
}
