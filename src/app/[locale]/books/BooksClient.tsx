'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Book } from '@/services/book.service';
import { useAudio } from '@/contexts/AudioContext';
import useSound from 'use-sound';
import ButtonDefault from '@/components/ButtonDefault';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface BooksClientProps {
    books: Book[];
}

export default function BooksClient({ books }: BooksClientProps) {
    const t = useTranslations();
    const { sfxVolume } = useAudio();
    const [playHover] = useSound("/audio/hover.mp3", { volume: sfxVolume });
    const [playClick] = useSound("/audio/click.mp3", { volume: sfxVolume });
    const [playSwitch] = useSound("/audio/switch.mp3", { volume: sfxVolume });
    const [expandedInfo, setExpandedInfo] = useState<string | null>(null);

    const handleBookClick = (url: string) => {
        playClick();
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleBookHover = () => {
        playHover();
    };

    const handleToggleInfo = (url: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedInfo(prev => prev === url ? null : url);
        playSwitch();
    };

    if (books.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-white/80 text-lg">
                    {t('books.noResults')}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
                <article 
                    key={book.url}
                    className="flex flex-col backdrop-blur-md bg-black/50 rounded-2xl border border-white/10 p-4
                               hover:border-yellow-400/60 hover:bg-black/60 
                               transition-all duration-300 cursor-pointer group h-full shadow-lg"
                    onMouseEnter={handleBookHover}
                    onClick={() => handleBookClick(book.url)}
                >
                    {/* Book Cover */}
                    <div className="w-full aspect-2/3 relative mb-4 rounded-xl overflow-hidden shrink-0">
                        <Image
                            src={book.image}
                            alt={`${book.title} - ${book.author}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-300"
                            loading="lazy"
                        />
                    </div>

                    {/* Book Info */}
                    <div className="flex flex-col grow">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors tracking-wide">
                                {book.title}
                            </h3>
                            <button
                                onClick={(e) => handleToggleInfo(book.url, e)}
                                className="shrink-0 text-white/50 hover:text-yellow-400 transition-colors mt-0.5 cursor-pointer"
                                aria-label={`Info: ${book.title}`}
                            >
                                <IoInformationCircleOutline size={20} />
                            </button>
                        </div>
                        <p className="text-yellow-400/80 text-sm tracking-wide">
                            {book.author}
                        </p>
                        {expandedInfo === book.url && (
                            <p className="text-sm text-white/70 mt-2 leading-relaxed">
                                {book.description}
                            </p>
                        )}
                    </div>

                    {/* Buy Button */}
                    <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                        <ButtonDefault 
                            size="sm"
                            fullWidth
                            onClick={() => handleBookClick(book.url)}
                            aria-label={`${t('books.buy')}: ${book.title}`}
                        >
                            {t('books.buy')}
                        </ButtonDefault>
                    </div>
                </article>
            ))}
        </div>
    );
}
