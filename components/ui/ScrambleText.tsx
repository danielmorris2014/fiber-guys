"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/";

interface ScrambleTextProps {
    children: string;
    className?: string;
    delay?: number;
    speed?: number;
    hover?: boolean;
}

export function ScrambleText({
    children: text,
    className,
    delay = 0,
    speed = 40,
    hover = true,
}: ScrambleTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout>(null);
    const reduced = useReducedMotion();

    const scramble = () => {
        if (reduced) return;

        let iteration = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText((prev) =>
                text
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

            iteration += 1 / 2;
        }, speed);
    };

    useEffect(() => {
        if (!hover && !reduced) {
            setTimeout(scramble, delay * 1000);
        }
    }, [hover, reduced, delay]);

    const handleMouseEnter = () => {
        if (hover && !reduced) {
            setIsHovered(true);
            scramble();
        }
    };

    return (
        <span
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovered(false)}
        >
            {displayText}
        </span>
    );
}
