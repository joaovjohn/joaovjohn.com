'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import useSound from "use-sound"
import { useAudio } from "@/contexts/AudioContext"

interface ButtonSwitchProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export default function ButtonSwitch({ 
    children, 
    className = '',
    size = 'md',
    onClick,
    onMouseEnter,
    ...props 
}: ButtonSwitchProps) {
    const { sfxVolume } = useAudio();
    const [playClick] = useSound("/audio/switch.mp3", { volume: sfxVolume * 1.5 })
    const [playHover] = useSound("/audio/hover.mp3", { volume: sfxVolume })
   
    const sizeClasses = {
        sm: 'w-8 h-8 text-lg',
        md: 'w-12 h-12 text-2xl',
        lg: 'w-14 h-14 text-3xl',
    };

    return (
        <button
            className={`
                relative flex items-center justify-center
                bg-transparent border-none
                cursor-pointer
                transition-transform duration-300 ease-out
                hover:scale-125
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400
                ${sizeClasses[size]}
                ${className}
            `}
            onClick={(event) => { 
                playClick();
                onClick?.(event);
            }}
            onMouseEnter={(event) => {
                playHover()
                onMouseEnter?.(event)
            }}
            {...props}
        >
            {/* Ícone com animação de pulsar e piscar */}
            <span className="text-yellow-400 animate-pulse-blink">
                {children}
            </span>
        </button>
    );
}
