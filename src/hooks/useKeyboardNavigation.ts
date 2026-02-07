'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseKeyboardNavigationProps {
    itemCount: number;
    onSelect?: (index: number) => void;
    enabled?: boolean;
    containerSelector?: string;
}

function getColumnsFromWidth(): number {
    if (typeof window === 'undefined') return 2;
    if (window.innerWidth >= 1024) return 4; // lg - 4 colunas
    if (window.innerWidth >= 768) return 3;  // md - 3 colunas
    return 2; // mobile - 2 colunas
}

export function useKeyboardNavigation({
    itemCount,
    onSelect,
    enabled = true,
    containerSelector = '[data-book-index]'
}: UseKeyboardNavigationProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [columns, setColumns] = useState(1);

    // Update columns on resize
    useEffect(() => {
        const updateColumns = () => {
            setColumns(getColumnsFromWidth());
        };
        
        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    // Focus the active item using data attribute
    useEffect(() => {
        if (enabled && itemCount > 0) {
            const element = document.querySelector(`[data-book-index="${activeIndex}"]`) as HTMLElement;
            element?.focus();
        }
    }, [activeIndex, enabled, itemCount]);

    // Reset active index when item count changes
    useEffect(() => {
        if (activeIndex >= itemCount) {
            setActiveIndex(Math.max(0, itemCount - 1));
        }
    }, [itemCount, activeIndex]);

    const moveFocus = useCallback((newIndex: number) => {
        if (newIndex >= 0 && newIndex < itemCount) {
            setActiveIndex(newIndex);
        }
    }, [itemCount]);

    useEffect(() => {
        if (!enabled || itemCount === 0) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if we're in an input field
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            const currentRow = Math.floor(activeIndex / columns);
            const totalRows = Math.ceil(itemCount / columns);

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (activeIndex > 0) {
                        moveFocus(activeIndex - 1);
                    } else {
                        // Cycle to last item
                        moveFocus(itemCount - 1);
                    }
                    break;

                case 'ArrowRight':
                    e.preventDefault();
                    if (activeIndex < itemCount - 1) {
                        moveFocus(activeIndex + 1);
                    } else {
                        // Cycle to first item
                        moveFocus(0);
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    if (currentRow > 0) {
                        moveFocus(activeIndex - columns);
                    } else {
                        // Jump to same column in last row
                        const lastRowStart = (totalRows - 1) * columns;
                        const targetIndex = Math.min(lastRowStart + (activeIndex % columns), itemCount - 1);
                        moveFocus(targetIndex);
                    }
                    break;

                case 'ArrowDown':
                    e.preventDefault();
                    if (currentRow < totalRows - 1) {
                        const nextIndex = Math.min(activeIndex + columns, itemCount - 1);
                        moveFocus(nextIndex);
                    } else {
                        // Jump to same column in first row
                        moveFocus(activeIndex % columns);
                    }
                    break;

                case 'Enter':
                case ' ':
                    const activeElement = document.querySelector(`[data-book-index="${activeIndex}"]`);
                    if (document.activeElement === activeElement) {
                        e.preventDefault();
                        onSelect?.(activeIndex);
                    }
                    break;

                case 'Home':
                    e.preventDefault();
                    moveFocus(0);
                    break;

                case 'End':
                    e.preventDefault();
                    moveFocus(itemCount - 1);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, columns, itemCount, enabled, moveFocus, onSelect]);

    return {
        activeIndex,
        setActiveIndex,
        moveFocus,
        columns
    };
}
