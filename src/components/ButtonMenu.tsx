"use client"

import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState, useId } from "react"
import { useAudio } from "@/contexts/AudioContext"

interface ButtonMenuProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  isActive?: boolean
}

export function ButtonMenu({
    label = "MENU",
    isActive = true,
    className,
    onClick,
    onMouseEnter,
    onPointerEnter,
    onFocus,
    ...props
}: ButtonMenuProps) {
    const height = 94
    const shadowPadding = 20
    const [textWidth, setTextWidth] = useState(0)
    const textRef = useRef<HTMLSpanElement>(null)
    const [isMeasured, setIsMeasured] = useState(false)
    const filterId = useId().replace(/:/g, "")
    const { actions: { playSfx } } = useAudio()

    useEffect(() => {
        if (textRef.current) {
            const measured = textRef.current.getBoundingClientRect().width
            setTextWidth(measured)
            setIsMeasured(true)
        }
    }, [label])

    // Fixed dimensions from original SVG
    const leftStartX = 43.5707
    const rightShapeY = 35.719
    const rightShapeWidth = 37.8657
    const rightShapeHeight = 54.0572
    const padding = 20


    const rightShapeExtra = 45 // Extra space to ensure the right shape is fully visible
    const letterOverlap = 25 // Quanto antes da última letra a inclinação começa

    const totalWidth = leftStartX + padding + textWidth + rightShapeExtra - letterOverlap

    const rightShapeX = leftStartX + padding + textWidth - letterOverlap - 20

    // Central rect extends from left shape to cover the right shape
    const centralRectWidth = rightShapeX - leftStartX + 31

    return (
        <button
            className={cn(
                "relative group cursor-pointer transition-transform",
                isActive && "hover:scale-105 active:scale-95",
                !isMeasured && "invisible",
                isMeasured && "visible",
                className,
            )}
            style={{ width: `${totalWidth + shadowPadding}px`, height: `${height + shadowPadding}px` }}
            onClick={(event) => { playSfx('click'); onClick?.(event); }}
            onMouseEnter={(event) => {
                playSfx('hover')
                onMouseEnter?.(event)
            }}
            {...(isActive ? {} : { tabIndex: -1, 'aria-disabled': true })}
            {...props}
        >
            {/* Hidden span for measurement */}
            <span
                ref={textRef}
                className="absolute opacity-0 pointer-events-none font-bold uppercase whitespace-nowrap"
                style={{
                    fontFamily: "var(--font-archivo-black), sans-serif",
                    fontSize: "40px",
                    letterSpacing: "0.1em",
                }}
                aria-hidden="true"
            >
                {label}
            </span>

            <svg
                width={totalWidth + shadowPadding}
                height={height + shadowPadding}
                viewBox={`-${shadowPadding / 2} -${shadowPadding / 2} ${totalWidth + shadowPadding} ${height + shadowPadding}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn("absolute inset-0 transition-opacity duration-200", !isActive && "opacity-0")}
                style={{ overflow: "visible" }}
            >
                <defs>
                    <filter
                        id={filterId}
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                        filterUnits="objectBoundingBox"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feMorphology radius="4" operator="dilate" in="SourceAlpha" result="effect1_dropShadow" />
                        <feOffset />
                        <feGaussianBlur stdDeviation="5" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0.835294 0 0 0 0 0.635294 0 0 0 0 0.545098 0 0 0 1 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                    </filter>
                </defs>

                <g opacity="0.75" filter={`url(#${filterId})`}>
                    {/* Central Rectangle - Dynamic Width */}
                    <rect x={leftStartX} y="14" width={centralRectWidth} height="66" fill="#020D01" />

                    {/* Left Corner - Fixed Position */}
                    <rect
                        width="55.9238"
                        height="34.8988"
                        transform={`matrix(0.528767 0.848767 -0.847327 0.531072 ${leftStartX} 14)`}
                        fill="#020D01"
                    />

                    {/* Right Corner - Positioned to overlap last letter but fully visible */}
                    <rect
                        x={rightShapeX}
                        y={rightShapeY}
                        width={rightShapeWidth}
                        height={rightShapeHeight}
                        transform={`rotate(-35 ${rightShapeX} ${rightShapeY})`}
                        fill="#020D01"
                    />
                </g>
            </svg>

            {/* Text positioned from the left */}
            <div
                className="absolute inset-0 flex items-center overflow-visible"
                style={{
                    paddingLeft: `${leftStartX + padding + shadowPadding / 2}px`,
                    //   paddingTop: `${shadowPadding / 2}px`,
                }}
            >
                <span
                    className={cn(
                        "font-bold uppercase whitespace-nowrap relative z-10 transition-colors duration-200",
                        !isActive && "text-white",
                    )}
                    style={{
                        fontFamily: "var(--font-archivo-black), sans-serif",
                        fontSize: "40px",
                        letterSpacing: "0.1em",
                        ...(isActive
                            ? {
                                color: "#FFFFFF",
                                WebkitTextFillColor: "#FFFFFF",
                                WebkitTextStroke: "2px #D5A28B",
                                paintOrder: "stroke fill",
                                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                            }
                            : {
                                WebkitTextFillColor: "unset",
                                WebkitTextStroke: "unset",
                                filter: "none",
                            }),
                    }}
                >
                    {label}
                </span>
            </div>
        </button>
    )
}
