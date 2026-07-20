"use client";

import type { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";
import { createContext, useContext } from "react";

type TTSVoiceItems = inferRouterOutputs<AppRouter>["voices"]["getAll"]["custom"][number];

interface TTSVoicesContextValue {
    customVoices: TTSVoiceItems[];
    systemVoices: TTSVoiceItems[];
    allVoices: TTSVoiceItems[];
};

const TTSVoiceContext = createContext<TTSVoicesContextValue | null>(null);

export function TTSVoicesProvider({ children, value }: { children: React.ReactNode, value: TTSVoicesContextValue }) {
    return (
        <TTSVoiceContext.Provider value={value}>
            {children}
        </TTSVoiceContext.Provider>
    )
};

export function useTTSVoices() {
    const context = useContext(TTSVoiceContext);
    if(!context) {
        throw new Error("useTTSVoices must be used within a TTSVoicesProvider");
    }
    return context;
}