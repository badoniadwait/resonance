import z from "zod";
import { createTRPCRouter, orgProcedure } from "../init";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { chatterbox } from "@/lib/chatterbox-client";
import { uploadAudio } from "@/lib/cloudinary";

export const generationRouter = createTRPCRouter({
    getById: orgProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const generation = await prisma.generation.findUnique({
                where: { id: input.id, orgId: ctx.orgId },
                omit: {
                    orgId: true,
                    cloudinaryPublicId: true,
                },
            })
            if (!generation) {
                throw new TRPCError({ code: "NOT_FOUND" })
            }
            return {
                ...generation,
                audioUrl: `/api/audio/${generation.id}`,
            }
        }),
    getAll: orgProcedure.query(async ({ ctx }) => {
        const generations = await prisma.generation.findMany({
            where: { orgId: ctx.orgId },
            orderBy: { createdAt: "desc" },
            omit: {
                orgId: true,
                cloudinaryPublicId: true,
            }
        });
        return generations;
    }),
    create: orgProcedure
        .input(
            z.object({
                text: z.string().min(1).max(TEXT_MAX_LENGTH),
                voiceId: z.string().min(1),
                temperature: z.number().min(0).max(2).default(0.8),
                topP: z.number().min(0).max(1).default(0.95),
                topK: z.number().min(1).max(10000).default(1000),
                repetitionPenalty: z.number().min(1).max(2).default(1.2),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const voice = await prisma.voice.findUnique({
                where: {
                    id: input.voiceId,
                    OR: [{ variant: "SYSTEM" }, { variant: "CUSTOM", orgId: ctx.orgId, }],
                },
                select: {
                    id: true,
                    name: true,
                    cloudinaryPublicId: true,
                }
            });
            if (!voice) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Voice not found",
                });
            }
            if (!voice.cloudinaryPublicId) {
                throw new TRPCError({
                    code: "PRECONDITION_FAILED",
                    message: "Voice audio is not available",
                });
            }

            const { data, error } = await chatterbox.POST("/generate", {
                body: {
                    prompt: input.text,
                    voice_key: voice.cloudinaryPublicId,
                    temperature: input.temperature,
                    top_p: input.topP,
                    top_k: input.topK,
                    repetition_penalty: input.repetitionPenalty,
                    norm_loudness: true,
                },
                parseAs: "arrayBuffer",
            });

            const buffer = Buffer.from(data);
            let generationId: string | null = null;
            let cloudinaryPublicId: string | null = null;

            try {
                const generation = await prisma.generation.create({
                    data: {
                        orgId: ctx.orgId,
                        text: input.text,
                        voiceName: voice.name,
                        voiceId: voice.id,
                        temperature: input.temperature,
                        topK: input.topK,
                        topP: input.topP,
                        repetitionPenalty: input.repetitionPenalty,
                    },
                    select: {
                        id: true,
                    },
                });

                generationId = generation.id;
                cloudinaryPublicId = `generations/orgs/${ctx.orgId}/${generationId}`;
                await uploadAudio({ buffer, key: cloudinaryPublicId });
                await prisma.generation.update({
                    where: {
                        id: generationId,
                    },
                    data: {
                        cloudinaryPublicId,
                    },
                })
            } catch {
                if(generationId) {
                    await prisma.generation.delete({
                        where: {id: generationId},
                    }).catch(() => {});
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to store generated audio",
                });
            }

            if(!generationId || !cloudinaryPublicId) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to store generated audio"
                });
            }
            return {
                id: generationId,
            };
        })
});