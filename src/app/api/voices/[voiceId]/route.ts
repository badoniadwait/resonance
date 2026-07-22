import { getSignedAudioUrl } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET(
    _request: Request,
    {params} : {params: Promise<{voiceId:string}>}
) {
    const {userId, orgId} = await auth();

    if(!userId||!orgId) {
        return new Response("Unauthorized", {status: 401});
    }

    const {voiceId} = await params;

    const voice = await prisma.voice.findUnique({
        where: {id: voiceId},
        select: {
            variant: true,
            orgId: true,
            cloudinaryPublicId: true
        },
    });
    if(!voice) {
        return new Response("Not Found", {status: 404});
    }

    if(voice.variant === "CUSTOM" && voice.orgId !== orgId) {
        return new Response("Not Found", {status: 404});
    }

    if(!voice.cloudinaryPublicId) {
        return new Response("Voice audio is not available yet", {status: 409});
    }

    const signedUrl = await getSignedAudioUrl(voice.cloudinaryPublicId);
    const audioResponse = await fetch(signedUrl);

    if(!audioResponse.ok) {
        return new Response("Failed to fetch voice audio", {status: 502});
    }

    const contentType = audioResponse.headers.get("content-type") || "audio/wav";
    
    return new Response(audioResponse.body, {
        headers: {
            "Content-Type": contentType,
            "Cache-Control" : voice.variant === "SYSTEM" ? "public, max-age=86400" : "private, max-age=3600"
        }
    })
};