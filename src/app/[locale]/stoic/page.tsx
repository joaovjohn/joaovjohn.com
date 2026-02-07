'use client';

import { useEffect, useState, useRef, useTransition } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { stoicService } from '@/services/stoic.service';
import ButtonBack from '@/components/ButtonBack';
import ButtonSwitch from '@/components/ButtonSwitch';
import { useAudio } from '@/contexts/AudioContext';
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";


interface Quote {
    text: string;
    author: string;
}

export default function StoicPage() {
    const locale = useLocale();
    const t = useTranslations();
    const { sfxVolume } = useAudio();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [current, setCurrent] = useState(0);
    const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isPending, startTransition] = useTransition();
    const previousLocaleRef = useRef(locale);


    useEffect(() => {
        const loadQuotes = async () => {
            // Only show loading if locale actually changed
            const localeChanged = previousLocaleRef.current !== locale;
            if (localeChanged) {
                setIsLoadingQuotes(true);
            }
            previousLocaleRef.current = locale;
            
            const validLocale = (locale === 'pt-br' || locale === 'en') ? locale : 'en';
            const allQuotes = await stoicService.getQuotes(validLocale);
            const dailyQuotes = stoicService.getDailyQuotes(allQuotes);
            setQuotes(dailyQuotes);
            
            // Only restore saved index on initial load, not on locale change
            if (!localeChanged) {
                const savedIndex = sessionStorage.getItem('stoicIndex');
                if (savedIndex) {
                    const index = parseInt(savedIndex);
                    if (!isNaN(index) && index >= 0 && index < dailyQuotes.length) {
                        setCurrent(index);
                    }
                }
            }
            
            setIsLoadingQuotes(false);
        };
        
        startTransition(() => {
            loadQuotes();
        });
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
            setCurrent(current + 1);
        }
        if (isRightSwipe && current > 0) {
            setCurrent(current - 1);
        }
    };

    const handlePrev = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const handleNext = () => {
        if (current < quotes.length - 1) setCurrent(current + 1);
    };

    // Only show loading on initial load, not on locale change
    // This prevents the flash when switching languages
    if (isLoadingQuotes && quotes.length === 0) {
        return (
            <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
                <Image 
                    src="/img/wallpaper_stoic.png" 
                    alt="Stoic Background" 
                    fill 
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 z-1" />
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

            {/* Botão Voltar */}
            <div className="absolute top-10 left-10 z-20">
                <ButtonBack />
            </div>

            {/* Container principal com navegação */}
            <div className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-4">
                
                {/* Botão Anterior - Ícone pulsando */}
                <div className="hidden md:flex items-center justify-center w-14 h-14">
                    {current > 0 && (
                        <ButtonSwitch
                            onClick={handlePrev}
                            size="lg"
                            aria-label="Previous quote"
                        >
                            <BiSolidLeftArrow />
                        </ButtonSwitch>
                    )}
                </div>

                {/* Card da Citação */}
                <div className="flex-1 backdrop-blur-md bg-black/50 p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
                    <blockquote className="text-center">
                        <p 
                            className="text-2xl md:text-4xl text-white font-light mb-8 leading-relaxed tracking-wide drop-shadow-md"
                            style={{ fontFamily: 'ManifontGroteskBookItalic, sans-serif' }}
                        >
                            &ldquo;{quote.text}&rdquo;
                        </p>
                        <footer 
                            className="text-lg md:text-xl text-yellow-400 font-medium tracking-widest uppercase opacity-90"
                            style={{ fontFamily: 'ManifontGroteskBookItalic, sans-serif' }}
                        >
                            — {quote.author}
                        </footer>
                    </blockquote>
                </div>

                {/* Botão Próximo - Ícone pulsando */}
                <div className="hidden md:flex items-center justify-center w-14 h-14">
                    {current < quotes.length - 1 && (
                        <ButtonSwitch
                            onClick={handleNext}
                            size="lg"
                            aria-label="Next quote"
                        >
                            <BiSolidRightArrow />
                        </ButtonSwitch>
                    )}
                </div>
            </div>

            {/* Indicadores de paginação */}
            <div className="relative z-10 flex justify-center gap-3 mt-12">
                {quotes.map((_, i: number) => (
                    <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-500 ${
                            i === current 
                                ? 'bg-yellow-400 w-10 shadow-[0_0_12px_rgba(250,204,21,0.8)]' 
                                : 'bg-white/30 w-2 hover:bg-white/60'
                        }`}
                        aria-label={`Go to quote ${i + 1}`}
                    />
                ))}
            </div>
            
            {/* Navegação Mobile - Botões nas laterais (visíveis apenas em telas pequenas) */}
            <div className="md:hidden flex justify-between w-full absolute top-1/2 -translate-y-1/2 px-4 z-10 pointer-events-none">
                {current > 0 && (
                    <ButtonSwitch 
                        className="pointer-events-auto"
                        onClick={handlePrev}
                        size="md"
                        aria-label="Previous quote"
                    >
                        <BiSolidLeftArrow />
                    </ButtonSwitch>
                )}
                <div className="flex-1" />
                {current < quotes.length - 1 && (
                    <ButtonSwitch 
                        className="pointer-events-auto"
                        onClick={handleNext}
                        size="md"
                        aria-label="Next quote"
                    >
                        <BiSolidRightArrow />
                    </ButtonSwitch>
                )}
            </div>
        </div>
    );
}
