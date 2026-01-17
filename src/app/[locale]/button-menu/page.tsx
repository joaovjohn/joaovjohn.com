"use client"

import { ButtonMenu } from "@/components/ButtonMenu"
import { useEffect, useState } from "react"

const MENU_ITEMS = [
    "MENU",
    "PROJECT LIST",
    "ABOUT ME",
    "CONTACT",
    "EXPERIMENTS"
]

export default function ButtonMenuInteractive() {
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp") {
                e.preventDefault()
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : MENU_ITEMS.length - 1))
            } else if (e.key === "ArrowDown") {
                e.preventDefault()
                setActiveIndex((prev) => (prev < MENU_ITEMS.length - 1 ? prev + 1 : 0))
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <main className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-12">
            <nav className="flex flex-col items-start gap-2" role="menu" aria-label="Main Navigation">
                {MENU_ITEMS.map((item, index) => {
                    const isActive = index === activeIndex

                    return (
                        <div
                            key={item}
                            className="relative flex items-center outline-none"
                            // Removed fixed height and width constraints that might conflict with ButtonMenu
                            onMouseEnter={() => setActiveIndex(index)}
                            role="menuitem"
                            tabIndex={isActive ? 0 : -1}
                            aria-current={isActive}
                        >
                            <ButtonMenu
                                label={item}
                                isActive={isActive}
                                onClick={() => console.log(`Navigating to ${item}`)}
                            />
                        </div>
                    )
                })}
            </nav>

            <p className="mt-16 text-zinc-600 font-mono text-sm uppercase tracking-widest opacity-50">
        Use Arrow Keys or Mouse
            </p>
        </main>
    )
}
