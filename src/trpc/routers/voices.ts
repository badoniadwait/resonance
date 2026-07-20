import z from "zod";
import { createTRPCRouter, orgProcedure } from "../init";
import { contains } from "@base-ui/react/internals/shadowDom";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { deleteAudio } from "@/lib/cloudinary";

export const voicesRouter = createTRPCRouter({
    getAll: orgProcedure.input(
        z.object({
            query: z.string().trim().optional(),
        })
            .optional(),
    )
        .query(async ({ ctx, input }) => {
            const searchFilter = input?.query ? {
                OR: [
                    { name: { contains: input.query, mode: "insensitive" as const } },
                    {
                        description: { contains: input.query, mode: "insensitive" as const }
                    }
                ]
            } : {};

            const [custom, system] = await Promise.all([
                prisma.voice.findMany({
                    where: {
                        variant: "CUSTOM",
                        orgId: ctx.orgId,
                    },
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        category: true,
                        language: true,
                        variant: true,
                    }
                }),
                prisma.voice.findMany({
                    where: {
                        variant: "SYSTEM",
                        ...searchFilter,
                    },
                    orderBy: {
                        name: "asc"
                    },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        category: true,
                        language: true,
                        variant: true,
                    },

                }),
            ]);
            return { custom, system }
        }),
    delete: orgProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const voice = await prisma.voice.findUnique({
                where: {
                    id: input.id,
                    variant: "CUSTOM",
                    orgId: ctx.orgId,
                },
                select: { id: true, cloudinaryPublicId: true },
            });
            if (!voice) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Voice not found"
                })
            }

            const tombstone = voice.cloudinaryPublicId
                ? await prisma.deletionTombstone.create({
                    data: { cloudinaryPublicId: voice.cloudinaryPublicId }
                })
                : null;

            await prisma.voice.delete({
                where: {id: voice.id}
            });

            if (tombstone) {
                try {
                    await deleteAudio(voice.cloudinaryPublicId!);
                    await prisma.deletionTombstone.delete({ where: { id: tombstone.id } });
                } catch (err) {
                    await prisma.deletionTombstone.update({
                        where: { id: tombstone.id },
                        data: { retryCount: { increment: 1 }, lastError: String(err) },
                    });
                }
            }
        }),
});