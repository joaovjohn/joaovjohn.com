"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

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

export type SfxSound = 'click' | 'hover' | 'back' | 'switch';

const SFX_PATHS: Record<SfxSound, string> = {
    click: '/audio/click.mp3',
    hover: '/audio/hover.mp3',
    back: '/audio/back.mp3',
    switch: '/audio/switch.mp3',
};

interface AudioState {
    isPlaying: boolean;
    musicVolume: number;
    sfxVolume: number;
    currentSong: Song;
    hasInteracted: boolean;
}

interface AudioActions {
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;
    setMusicVolume: (v: number) => void;
    setSfxVolume: (v: number) => void;
    playSfx: (sound: SfxSound) => void;
}

interface AudioContextValue {
    state: AudioState;
    actions: AudioActions;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

// --- A-02: localStorage helpers com versioning e try/catch ---
const STORAGE_V = 'v1';
const storageKey = (k: string) => `audio:${STORAGE_V}:${k}`;

const safeGet = (k: string, fallback: string): string => {
    try { return localStorage.getItem(storageKey(k)) ?? fallback; } catch { return fallback; }
};
const safeSet = (k: string, v: string): void => {
    try { localStorage.setItem(storageKey(k), v); } catch { /* storage full or unavailable */ }
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [musicVolume, setMusicVolume] = useState(0.3);
    const [sfxVolume, setSfxVolume] = useState(1.0);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    // SFX pool — single Howl per sound type
    const sfxPoolRef = useRef<Map<SfxSound, Howl> | null>(null);
    const sfxVolumeRef = useRef(sfxVolume);
    sfxVolumeRef.current = sfxVolume;

    const getSfxPool = useCallback(() => {
        if (!sfxPoolRef.current) {
            const pool = new Map<SfxSound, Howl>();
            for (const [key, path] of Object.entries(SFX_PATHS)) {
                pool.set(key as SfxSound, new Howl({ src: [path], preload: true }));
            }
            sfxPoolRef.current = pool;
        }
        return sfxPoolRef.current;
    }, []);

    const playSfx = useCallback((sound: SfxSound) => {
        const pool = getSfxPool();
        const howl = pool.get(sound);
        if (howl) {
            howl.volume(sfxVolumeRef.current);
            howl.play();
        }
    }, [getSfxPool]);

    // Audio ref para controle nativo (persistente entre trocas de idioma)
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Refs para valores usados em event listeners estáveis (evita stale closures)
    const hasInteractedRef = useRef(hasInteracted);
    const isPlayingRef = useRef(isPlaying);

    // Sincronizar refs com state
    useEffect(() => { hasInteractedRef.current = hasInteracted; }, [hasInteracted]);
    useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

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

    // Load from localStorage (including song index to avoid hydration mismatch)
    useEffect(() => {
        const savedMusicVol = safeGet('musicVolume', '');
        const savedSfxVol = safeGet('sfxVolume', '');
        const savedIsPlaying = safeGet('wasPlaying', '');
        const savedSongIndex = safeGet('currentSongIndex', '');

        if (savedMusicVol) setMusicVolume(parseFloat(savedMusicVol));
        if (savedSfxVol) setSfxVolume(parseFloat(savedSfxVol));
        if (savedSongIndex) setCurrentSongIndex(parseInt(savedSongIndex, 10));
        if (savedIsPlaying === "true") {
            setHasInteracted(false);
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        safeSet('musicVolume', musicVolume.toString());
        if (audioRef.current) audioRef.current.volume = musicVolume;
    }, [musicVolume]);

    useEffect(() => {
        safeSet('sfxVolume', sfxVolume.toString());
    }, [sfxVolume]);

    // Setup global interaction listener — usa refs para manter listeners estáveis
    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteractedRef.current) {
                setHasInteracted(true);
                if (audioRef.current && !isPlayingRef.current) {
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
    }, []);

    // Handle play/pause effect e salvar estado global
    useEffect(() => {
        if (!audioRef.current) return;
        
        // Salvar estado global para persistir entre navegações SPA
        (window as Window & { __audioState?: { isPlaying: boolean; songIndex: number } }).__audioState = {
            isPlaying,
            songIndex: currentSongIndex
        };
        
        // Salvar no localStorage para persistir entre refreshes
        safeSet('currentSongIndex', currentSongIndex.toString());
        safeSet('wasPlaying', isPlaying.toString());

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

    const playNext = useCallback(() => {
        setCurrentSongIndex(prev => (prev + 1) % PLAYLIST.length);
    }, []);

    const playPrev = useCallback(() => {
        setCurrentSongIndex(prev => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    }, []);

    const togglePlay = useCallback(() => {
        setIsPlaying(prev => !prev);
    }, []);

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
    }, [playNext]);

    const contextValue: AudioContextValue = {
        state: {
            isPlaying,
            musicVolume,
            sfxVolume,
            currentSong: PLAYLIST[currentSongIndex],
            hasInteracted,
        },
        actions: {
            togglePlay,
            playNext,
            playPrev,
            setMusicVolume,
            setSfxVolume,
            playSfx,
        },
    };

    return (
        <AudioContext.Provider value={contextValue}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within an AudioProvider");
    return context;
}
