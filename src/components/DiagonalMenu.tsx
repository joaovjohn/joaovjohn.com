"use client";

import { useState } from "react";
import { ButtonMenu } from "./ButtonMenu";
import { useAudio } from "@/contexts/AudioContext";
import { useNavigationLoader } from "@/contexts/NavigationLoaderContext";

export interface DiagonalMenuItem {
    href: string;
    label: string;
}

interface DiagonalMenuProps {
    items: DiagonalMenuItem[];
}

export function DiagonalMenu({ items }: DiagonalMenuProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const { actions: { playSfx } } = useAudio();
    const { navigateTo } = useNavigationLoader();

    const baseOffsetX = 4;

    return (
        <nav
            className="absolute left-[8vw] top-[15vh] flex flex-col z-20"
            style={{ gap: "-10px" }}
            aria-label="Main navigation"
        >
            {items.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                    <div
                        key={item.href}
                        className="block text-left no-underline"
                        style={{
                            marginLeft: `${index * baseOffsetX}vw`,
                            marginTop: index === 0 ? 0 : "-35px",
                            transform: "scale(0.9)",
                            transformOrigin: "center",
                        }}
                    >
                        <ButtonMenu 
                            label={item.label} 
                            isActive={isActive} 
                            onClick={() => { playSfx('click'); navigateTo(item.href); }}
                            onMouseEnter={() => setActiveIndex(index)} 
                        />
                    </div>
                );
            })}
        </nav>
    );
}
