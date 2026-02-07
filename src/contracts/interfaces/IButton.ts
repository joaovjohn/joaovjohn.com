import { type ReactNode, type CSSProperties, type ButtonHTMLAttributes } from 'react';

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    /**
     * Variantes visuais do botão.
     * - default/custom: mantém o visual "Bomba Patch" (SVG)
     * - ghost: botão textual/leve
     * - icon: botão compacto para ícones/controles (setas, dots)
     */
    variant?: 'default' | 'custom' | 'ghost' | 'icon' | 'back';
    /**
     * Tamanhos sugeridos para variantes leves (ghost/icon).
     * Para o botão SVG (default/custom), o tamanho é controlado via CSS.
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Se definido, o componente deve se comportar como navegação (Link).
     */
    href?: string;
    onHover?: () => void;
    disableSound?: boolean;
    style?: CSSProperties;
    /**
     * Se true, o botão ocupa 100% da largura do container sem min-width.
     */
    fullWidth?: boolean;
}