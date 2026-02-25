"use client";

import { useAudio } from "@/contexts/AudioContext";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { 
    IoMusicalNotes, 
    IoPlay, 
    IoPlaySkipBack, 
    IoPlaySkipForward, 
    IoRemove, 
    IoSparkles 
} from "react-icons/io5";
import { IoIosPause } from "react-icons/io";

export function AudioPlayer() {
    const t = useTranslations("player");
    const { 
        state: { isPlaying, musicVolume, sfxVolume, currentSong },
        actions: { togglePlay, playNext, playPrev, setMusicVolume, setSfxVolume },
    } = useAudio();
    
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isExpanded) return;

        const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;
            if (containerRef.current && !containerRef.current.contains(target)) {
                setIsExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [isExpanded]);

    return (
        <div 
            ref={containerRef}
            className={cn(
                "fixed bottom-8 left-8 z-50 transition-all duration-300 ease-in-out bg-zinc-900/90 border border-zinc-800 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden",
                isExpanded ? "w-80 h-auto p-6" : "w-14 h-14 p-0 cursor-pointer hover:scale-105 active:scale-95"
            )}
            onClick={(e) => {
                if (!isExpanded) {
                    setIsExpanded(true);
                    e.stopPropagation();
                }
            }}
        >
            {/* View Colapsada (Botão Flutuante) */}
            {!isExpanded && (
                <div className="w-full h-full flex items-center justify-center group">
                    <div className={cn("relative", isPlaying && "animate-pulse")}>
                        <IoMusicalNotes className="w-6 h-6 text-zinc-200" />
                    </div>
                </div>
            )}

            {/* View Expandida */}
            {isExpanded && (
                <div className="flex flex-col gap-4 relative">
                    {/* Botão minimizar */}
                    <button 
                        className="cursor-pointer absolute -top-2 -right-2 p-2 text-zinc-500 hover:text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(false);
                        }}
                    >
                        <IoRemove className="w-4 h-4" />
                    </button>

                    {/* Info da Música */}
                    <div className="mb-2">
                        <div className="text-xs text-zinc-400 uppercase tracking-wide mb-1">{t("nowPlaying")}</div>
                        <div className="text-white font-bold truncate pr-6">{currentSong.title}</div>
                        <div className="text-zinc-400 text-xs truncate">{currentSong.description}</div>
                    </div>

                    {/* Controles de Playback */}
                    <div className="flex items-center justify-between px-4 my-2">
                        <button 
                            onClick={playPrev} 
                            className="cursor-pointer text-zinc-400 hover:text-white transition-colors p-2"
                        >
                            <IoPlaySkipBack className="w-5 h-5" />
                        </button>
                        
                        <button 
                            onClick={togglePlay} 
                            className="
                                bg-cor-1 cursor-pointer rounded-full w-12 h-12 flex 
                                items-center justify-center hover:scale-110 active:scale-95 
                                transition-all shadow-lg"
                        >
                            {isPlaying ? (
                                <IoIosPause className="w-6 h-6 text-zinc-400" />
                            ) : (
                                <IoPlay className="w-6 h-6 text-zinc-400 ml-0.5" />
                            )}
                        </button>
                        
                        <button 
                            onClick={playNext} 
                            className="cursor-pointer text-zinc-400 hover:text-white transition-colors p-2"
                        >
                            <IoPlaySkipForward className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Controles de Volume */}
                    <div className="space-y-4 pt-2 border-t border-zinc">
                        {/* Volume Música */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-zinc-300">
                                <span className="flex items-center gap-1">
                                    <IoMusicalNotes className="w-3 h-3" />
                                    {t("music")}
                                </span>
                                <span>{Math.round(musicVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-400 hover:brightness-110 transition-all"
                            />
                        </div>

                        {/* Volume SFX */}
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-zinc-300">
                                <span className="flex items-center gap-1">
                                    <IoSparkles className="w-3 h-3" />
                                    {t("effects")}
                                </span>
                                <span>{Math.round(sfxVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={sfxVolume}
                                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                                className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-400 hover:brightness-110 transition-all"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
