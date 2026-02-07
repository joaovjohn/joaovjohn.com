'use client';

import { useAudio } from '@/contexts/AudioContext';
import { type IButtonProps } from '@/contracts/interfaces/IButton';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import useSound from 'use-sound';

export default function ButtonDefault({ 
    children, 
    className = '', 
    disabled = false,
    href,
    variant = 'default',
    onClick,
    onMouseEnter,
    size = 'md',
    fullWidth = false,
    ...props 
}: IButtonProps) {
    const sizeClasses =
        size === 'sm'
            ? 'text-sm px-3 py-2'
            : size === 'lg'
                ? 'text-lg px-5 py-3'
                : 'text-base px-4 py-2';

    const { sfxVolume } = useAudio()
    const [playClick] = variant == 'back' ?
        useSound("/audio/back.mp3", { volume: sfxVolume }) :
        useSound("/audio/click.mp3", { volume: sfxVolume })
    const [playHover] = useSound("/audio/hover.mp3", { volume: sfxVolume })

    if (variant === 'icon') {
        const iconClasses = `inline-flex items-center justify-center select-none transition-all duration-300 ease-out rounded-full
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`;

        if (href) {
            if (disabled) {
                return (
                    <span className={`${iconClasses} ${sizeClasses} ${className}`} aria-disabled="true">
                        {children}
                    </span>
                );
            }

            return (
                <Link href={href} className={`${iconClasses} ${sizeClasses} ${className}`} {...(props as any)}>
                    {children}
                </Link>
            );
        }

        return (
            <button
                className={`${iconClasses} ${sizeClasses} ${className}`}
                disabled={disabled}
                {...props}
            >
                {children}
            </button>
        );
    }

    if (variant === 'ghost') {
        const ghostClasses = `inline-flex items-center justify-center select-none transition-all duration-300 ease-out rounded-md
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}
            text-cor-1-lighter hover:text-cor-1
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`;

        if (href) {
            if (disabled) {
                return (
                    <span className={`${ghostClasses} ${sizeClasses} ${className}`} aria-disabled="true">
                        {children}
                    </span>
                );
            }

            return (
                <Link href={href} className={`${ghostClasses} ${sizeClasses} ${className}`} {...(props as any)}>
                    {children}
                </Link>
            );
        }

        return (
            <button
                className={`${ghostClasses} ${sizeClasses} ${className}`}
                disabled={disabled}
                {...props}
            >
                {children}
            </button>
        );
    }

    // Define dimensions based on size - mantém tamanho original
    const getSizeDimensions = () => {
        if (size === 'sm') {
            return {
                button: { width: 240, height: 44 },
                hover: { width: 230, height: 36 },
                container: { width: 240, height: 50 },
                heightClass: 'h-[44px]',
                hoverHeightClass: 'h-9',
                containerHeightClass: 'h-[50px]',
                textClass: 'text-base pl-5'
            };
        }
        if (size === 'lg') {
            return {
                button: { width: 360, height: 58 },
                hover: { width: 345, height: 48 },
                container: { width: 360, height: 68 },
                heightClass: 'h-[58px]',
                hoverHeightClass: 'h-12',
                containerHeightClass: 'h-[68px]',
                textClass: 'text-xl pl-7'
            };
        }
        // Default (md) - tamanho original do projeto
        return {
            button: { width: 300, height: 48 },
            hover: { width: 288, height: 40 },
            container: { width: 300, height: 56 },
            heightClass: 'h-12',
            hoverHeightClass: 'h-10',
            containerHeightClass: 'h-14',
            textClass: 'text-lg pl-6'
        };
    };
    
    const dimensions = getSizeDimensions();

    return (
        <button
            className={`group relative transition-all duration-300 ease-out
                ${fullWidth ? 'w-full' : 'w-fit'}
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'} 
                focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                ${className}`}
            disabled={disabled}
            onClick={(event) => {
                playClick();
                onClick?.(event);
            }}
            onMouseEnter={(event) => {
                playHover();
                onMouseEnter?.(event);
            }}
            onFocus={() => {
                playHover();
            }}
            {...props}
        >
            {/* Efeito de brilho */}
            <div className="absolute -inset-1 bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-lg opacity-0 group-hover:opacity-75 blur-sm transition-all duration-300" />
            
            {/* Botão default */}
            <Image
                src="/svg/button_default_complete.svg"
                alt=""
                width={dimensions.button.width}
                height={dimensions.button.height}
                className={`relative w-full ${dimensions.heightClass} group-hover:opacity-0 transition-all duration-300 ${fullWidth ? '' : 'min-w-[200px] sm:min-w-[250px] md:min-w-[300px]'}`}
                style={{ imageRendering: 'pixelated' }}
            />

            {/* Botão hover com animação de pulsação */}
            <Image
                src="/svg/button_hover.svg"
                alt=""
                width={dimensions.hover.width}
                height={dimensions.hover.height}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96%] ${dimensions.hoverHeightClass} opacity-0 group-hover:opacity-100 group-hover:animate-pulse-scale transition-all duration-300 drop-shadow-lg`}
                style={{ imageRendering: 'pixelated' }}
            />

            {/* Container de fundo (hover) */}
            <Image
                src="/svg/button_hover_container.svg"
                alt=""
                width={dimensions.container.width}
                height={dimensions.container.height}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${dimensions.containerHeightClass} opacity-0 group-hover:opacity-70 transition-all duration-300 pointer-events-none`}
                style={{ imageRendering: 'pixelated' }}
            />

            {/* Texto do botão */}
            <span 
                className={`absolute inset-0 flex items-center ${dimensions.textClass} tracking-[0.15em] text-gray-800 group-hover:text-black transition-all duration-300 pointer-events-none z-10`}
                style={{ fontFamily: 'Archivo Narrow, sans-serif', fontWeight: 500 }}
            >
                {children}
            </span>
        </button>
    );
}
