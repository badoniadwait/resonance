"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAudioPlayback(src: string | File | null) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const objectUrlRef = useRef<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        return () => {
            setIsPlaying(false);
            setIsLoading(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeAttribute("src");
                audioRef.current = null;
            }
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, [src]);

    const togglePlay = useCallback(() => {
        if (!src) return;

        if (!audioRef.current) {
            const url = src instanceof File ? URL.createObjectURL(src) : src;
            if (src instanceof File) {
                objectUrlRef.current = url;
            }
            audioRef.current = new Audio(url);
            audioRef.current.addEventListener("ended", () => setIsPlaying(false));
            audioRef.current.addEventListener(
                "canplaythrough",
                () => setIsLoading(false),
                { once: true },
            );
        }

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            setIsLoading(true);
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            });
        }
    }, [src, isPlaying]);

    return { isPlaying, isLoading, togglePlay };
};