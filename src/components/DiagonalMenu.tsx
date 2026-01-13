"use client";

import Link from "next/link";
import { useState } from "react";
import { ButtonMenu } from "./ButtonMenu";

export interface DiagonalMenuItem {
    href: string;
    label: string;
}

interface DiagonalMenuProps {
    items: DiagonalMenuItem[];
}

export function DiagonalMenu({ items }: DiagonalMenuProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Offset diagonal: mais agressivo horizontalmente, compacto verticalmente
    const baseOffsetX = 4; // vw por item (aumentado para mais diagonal)

    return (
        <nav
            className="absolute left-[8vw] top-[15vh] flex flex-col z-20"
            style={{ gap: "-10px" }}
            aria-label="Main navigation"
        >
            {items.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="block no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cor-1 rounded"
                        style={{
                            marginLeft: `${index * baseOffsetX}vw`,
                            marginTop: index === 0 ? 0 : "-35px",
                            transform: "scale(0.9)",
                            transformOrigin: "center",
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                    >
                        <ButtonMenu label={item.label} isActive={isActive} />
                    </Link>
                );
            })}
        </nav>
    );
}
