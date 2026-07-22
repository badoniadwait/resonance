import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

export function useCheckout() {
    const trpc = useTRPC();

    const mutation = useMutation(
        trpc.billing.createCheckout.mutationOptions({})
    );

    const checkout = useCallback(() => {
        mutation.mutate(undefined, {
            onSuccess: (data) => {
                window.location.href = data.checkoutUrl;
            },
        });
    }, [mutation]);

    return { checkout, isPending: mutation.isPending };
};