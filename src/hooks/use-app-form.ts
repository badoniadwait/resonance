"use client";


import {
    createFormHookContexts, createFormHook
} from "@tanstack/react-form"

export const {
    fieldContext,
    formContext,
    useFieldContext,
    useFormContext,
} = createFormHookContexts();

export const {
    useAppForm,
    useTypedAppFormContext,
} = createFormHook(
    {
        fieldComponents: {},
        fieldContext, 
        formComponents: {},
        formContext,   
    }
);
