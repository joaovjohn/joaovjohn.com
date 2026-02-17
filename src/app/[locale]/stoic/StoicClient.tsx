'use client';

import { useState, useEffect } from 'react';
import ButtonSwitch from '@/components/ButtonSwitch';
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";

export interface Quote {
    text: string;
    author: string;
}

interface StoicClientProps {
    quotes: Quote[];
}

export default function StoicClient({ quotes }: StoicClientProps) {
    const [current, setCurrent] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Restaurar índice salvo no mount
    useEffect(() => {
        const savedIndex = sessionStorage.getItem('stoicIndex');
        if (savedIndex) {
            const index = parseInt(savedIndex);
            if (!isNaN(index) && index >= 0 && index < quotes.length) {
                setCurrent(index);
            }
        }
    }, [quotes.length]);

    // Persistir índice atual
    useEffect(() => {
        sessionStorage.setItem('stoicIndex', current.toString());
    }, [current]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 50 && current < quotes.length - 1) setCurrent(current + 1);
        if (distance < -50 && current > 0) setCurrent(current - 1);
    };

    const handlePrev = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const handleNext = () => {
        if (current < quotes.length - 1) setCurrent(current + 1);
    };

    const quote = quotes[current];

    return (
        <div 
            className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Container principal com navegação */}
            <div className="w-full max-w-4xl flex items-center justify-between gap-4">
                
                {/* Botão Anterior - Desktop */}
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

                {/* Botão Próximo - Desktop */}
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
            <div className="flex justify-center gap-3 mt-12">
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
            
            {/* Navegação Mobile */}
            <div className="md:hidden flex justify-between w-full absolute top-1/2 -translate-y-1/2 px-4 pointer-events-none">
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
