"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export interface Song {
    title: string;
    description: string;
    url: string;
}

export const PLAYLIST: Song[] = [
    { title: "L'Amour Toujours (8-bit)", description: "Gigi D'Agostino", url: "/audio/music/(8-bit-version) Gigi D'Agostino - L'Amour Toujours.mp3" },
    { title: "Numb (8-bit)", description: "Linkin Park", url: "/audio/music/(8-bit-version) Numb - Linkin Park.mp3" },
    { title: "I Gotta Feeling (16-bit)", description: "The Black Eyed Peas", url: "/audio/music/(16-bit-version) The Black Eyed Peas - I Gotta Feeling.mp3" },
    { title: "Gimme Gimme Gimme (8-bit)", description: "ABBA", url: "/audio/music/(8-bit-version) ABBA - Gimme Gimme Gimme.mp3" },
    { title: "I'm Blue Instrumental (8-bit)", description: "Eiffel 65", url: "/audio/music/(8-bit-version) Eiffel 65 - I'm Blue Instrumental.mp3" },
    { title: "Good Feeling (8-bit)", description: "Flo Rida", url: "/audio/music/(8-bit-version) Flo Rida - Good Feeling.mp3" },
    { title: "In The End (8-bit)", description: "Linkin Park", url: "/audio/music/(8-bit-version) In The End - Linkin Park.mp3" },
    { title: "Bad Romance (8-bit)", description: "Lady Gaga", url: "/audio/music/(8-bit-version) Lady Gaga - Bad Romance.mp3" },
    { title: "Glad You Came (8-bit)", description: "The Wanted", url: "/audio/music/(8-bit-version) The Wanted - Glad You Came.mp3" },
];

interface AudioContextType {
    isPlaying: boolean;
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;
    musicVolume: number;
    setMusicVolume: (v: number) => void;
    sfxVolume: number;
    setSfxVolume: (v: number) => void;
    currentSong: Song;
    hasInteracted: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [musicVolume, setMusicVolume] = useState(0.3);
    const [sfxVolume, setSfxVolume] = useState(1.0);
    const [currentSongIndex, setCurrentSongIndex] = useState(() => {
        if (typeof window === "undefined") return 0;
        const savedSongIndex = localStorage.getItem("currentSongIndex");
        return savedSongIndex ? parseInt(savedSongIndex, 10) : 0;
    });

    // Audio ref para controle nativo (persistente entre trocas de idioma)
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Inicializa áudio global para não reiniciar entre layouts
    useEffect(() => {
        if (typeof window === "undefined") return;
        
        // Recuperar estado do globalAudio (para navegação SPA)
        const globalState = (window as Window & { __audioState?: { isPlaying: boolean; songIndex: number } }).__audioState;
        const globalAudio = (window as Window & { __globalAudio?: HTMLAudioElement }).__globalAudio;
        
        if (globalAudio) {
            audioRef.current = globalAudio;
            // Sincronizar estado React com o estado real do áudio
            if (globalState) {
                setCurrentSongIndex(globalState.songIndex);
                setIsPlaying(globalState.isPlaying);
                setHasInteracted(true);
            } else if (audioRef.current?.src) {
                const currentSrc = decodeURIComponent(audioRef.current.src);
                const foundIndex = PLAYLIST.findIndex((song) => currentSrc.includes(song.url));
                if (foundIndex >= 0) {
                    setCurrentSongIndex(foundIndex);
                }
            }
        } else {
            const audio = new Audio();
            audioRef.current = audio;
            (window as Window & { __globalAudio?: HTMLAudioElement }).__globalAudio = audio;
            audioRef.current.src = PLAYLIST[currentSongIndex].url;
            audioRef.current.volume = musicVolume;
        }
    }, []);

    // Load from localStorage
    useEffect(() => {
        const savedMusicVol = localStorage.getItem("musicVolume");
        const savedSfxVol = localStorage.getItem("sfxVolume");
        const savedIsPlaying = localStorage.getItem("wasPlaying");

        if (savedMusicVol) setMusicVolume(parseFloat(savedMusicVol));
        if (savedSfxVol) setSfxVolume(parseFloat(savedSfxVol));
        if (savedIsPlaying === "true") {
            setHasInteracted(false);
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("musicVolume", musicVolume.toString());
        if (audioRef.current) audioRef.current.volume = musicVolume;
    }, [musicVolume]);

    useEffect(() => {
        localStorage.setItem("sfxVolume", sfxVolume.toString());
    }, [sfxVolume]);

    // Setup global interaction listener
    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted) {
                setHasInteracted(true);
                if (audioRef.current && !isPlaying) {
                    setIsPlaying(true);
                    audioRef.current.play().catch((e) => {
                        console.warn("Autoplay blocked, needs explicit click", e);
                        setIsPlaying(false);
                    });
                }
            }
        };

        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);
        
        return () => {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        };
    }, [hasInteracted, isPlaying]);

    // Handle play/pause effect e salvar estado global
    useEffect(() => {
        if (!audioRef.current) return;
        
        // Salvar estado global para persistir entre navegações SPA
        (window as Window & { __audioState?: { isPlaying: boolean; songIndex: number } }).__audioState = {
            isPlaying,
            songIndex: currentSongIndex
        };
        
        // Salvar no localStorage para persistir entre refreshes
        localStorage.setItem("currentSongIndex", currentSongIndex.toString());
        localStorage.setItem("wasPlaying", isPlaying.toString());

        // Só muda src se for diferente (evita reiniciar música ao navegar)
        const newSrc = PLAYLIST[currentSongIndex].url;
        if (!audioRef.current.src.endsWith(encodeURI(newSrc.split('/').pop() || ''))) {
            audioRef.current.src = newSrc;
        }
        
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Play error:", e));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentSongIndex]);

    useEffect(() => {
        const handleEnded = () => playNext();
        if (audioRef.current) {
            audioRef.current.addEventListener("ended", handleEnded);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener("ended", handleEnded);
            }
        };
    }, [currentSongIndex]);

    const playNext = () => {
        setCurrentSongIndex(prev => (prev + 1) % PLAYLIST.length);
    };

    const playPrev = () => {
        setCurrentSongIndex(prev => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    };

    const togglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    return (
        <AudioContext.Provider value={{
            isPlaying,
            togglePlay,
            playNext,
            playPrev,
            musicVolume,
            setMusicVolume,
            sfxVolume,
            setSfxVolume,
            currentSong: PLAYLIST[currentSongIndex],
            hasInteracted
        }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within an AudioProvider");
    return context;
}
