'use client';

import { type IButtonProps } from '@/contracts/interfaces/IButton';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function ButtonDefault({ 
    children, 
    className = '', 
    disabled = false,
    href,
    variant = 'default',
    size = 'md',
    ...props 
}: IButtonProps) {
    const sizeClasses =
        size === 'sm'
            ? 'text-sm px-3 py-2'
            : size === 'lg'
                ? 'text-lg px-5 py-3'
                : 'text-base px-4 py-2';

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

    return (
        <button
            className={`group relative w-fit transition-all duration-300 ease-out
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'} 
                ${className}`}
            disabled={disabled}
            {...props}
        >
            {/* Efeito de brilho */}
            <div className="absolute -inset-1 bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-lg opacity-0 group-hover:opacity-75 blur-sm transition-all duration-300" />
            
            {/* Botão default */}
            <Image
                src="/svg/button_default_complete.svg"
                alt=""
                width={300}
                height={48}
                className="relative w-full min-w-[200px] sm:min-w-[250px] md:min-w-[300px] h-12 group-hover:opacity-0 transition-all duration-300"
                style={{ imageRendering: 'pixelated' }}
            />

            {/* Botão hover com animação de pulsação */}
            <Image
                src="/svg/button_hover.svg"
                alt=""
                width={288}
                height={40}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[96%] h-10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-scale transition-all duration-300 drop-shadow-lg"
                style={{ imageRendering: 'pixelated' }}
            />

            {/* Container de fundo (hover) - mais alto */}
            <Image
                src="/svg/button_hover_container.svg"
                alt=""
                width={300}
                height={56}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-14 opacity-0 group-hover:opacity-70 transition-all duration-300 pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
            />

            {/* Texto do botão */}
            <span 
                className="absolute inset-0 flex items-center pl-6 text-lg tracking-[0.15em] text-gray-800 group-hover:text-black transition-all duration-300 pointer-events-none z-10"
                style={{ fontFamily: 'Impact, sans-serif' }}
            >
                {children}
            </span>
        </button>
    );
}
