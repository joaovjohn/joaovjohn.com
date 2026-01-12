'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { stoicService } from '@/services/stoic.service';
import  ButtonDefault  from '@/components/ButtonDefault';

interface Quote {
  text: string;
  author: string;
}

export default function StoicPage() {
    const locale = useLocale();
    const t = useTranslations();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [current, setCurrent] = useState(0);
    const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    useEffect(() => {
        const loadQuotes = async () => {
            setIsLoadingQuotes(true);
            const allQuotes = await stoicService.getQuotes(locale === 'pt-br' ? 'en' : 'en');
            const dailyQuotes = stoicService.getDailyQuotes(allQuotes);
            setQuotes(dailyQuotes);
            setIsLoadingQuotes(false);
        };
        loadQuotes();
    }, [locale]);

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

    if (isLoadingQuotes) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-page">
                <div className="text-cor-1-lighter text-xl">{t('loading')}</div>
            </div>
        );
    }

    const quote = quotes[current];

    return (
        <div 
            className="relative min-h-screen bg-page flex items-center justify-center p-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <ButtonDefault
                href="/"
                variant="ghost"
                size="sm"
                className="absolute top-6 left-6"
            >
        ← {t('back')}
            </ButtonDefault>

            {current > 0 && (
                <ButtonDefault
                    variant="icon"
                    size="lg"
                    onClick={() => setCurrent(current - 1)}
                    className="absolute left-6 top-1/2 -translate-y-1/2"
                    aria-label="Previous quote"
                >
          ‹
                </ButtonDefault>
            )}
      
            {current < quotes.length - 1 && (
                <ButtonDefault
                    variant="icon"
                    size="lg"
                    onClick={() => setCurrent(current + 1)}
                    className="absolute right-6 top-1/2 -translate-y-1/2"
                    aria-label="Next quote"
                >
          ›
                </ButtonDefault>
            )}

            <div className="max-w-3xl mx-auto">
                <blockquote className="text-center">
                    <p className="text-2xl md:text-4xl text-cor-1 font-light mb-8 leading-relaxed">
            &ldquo;{quote.text}&rdquo;
                    </p>
                    <footer className="text-lg md:text-xl text-cor-1-lighter">
            — {quote.author}
                    </footer>
                </blockquote>
        
                <div className="flex justify-center gap-2 mt-12">
                    {quotes.map((_, i: number) => (
                        <ButtonDefault
                            key={i}
                            variant="icon"
                            size="sm"
                            onClick={() => setCurrent(i)}
                            className={`w-2 h-2 rounded-full transition-all p-0 ${
                                i === current ? 'bg-cor-1 w-8' : 'bg-cor-1/30'
                            }`}
                            aria-label={`Go to quote ${i + 1}`}
                        >
                            <span className="sr-only">{i + 1}</span>
                        </ButtonDefault>
                    ))}
                </div>
            </div>
        </div>
    );
}
