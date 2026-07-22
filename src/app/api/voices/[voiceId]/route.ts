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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let audioResponse: Response;
    try {
        audioResponse = await fetch(signedUrl, {
            signal: controller.signal,
            headers: _request.headers.has("Range")
                ? { Range: _request.headers.get("Range")! }
                : undefined,
        });
    } catch {
        clearTimeout(timeout);
        return new Response("Failed to fetch voice audio", { status: 502 });
    }
    clearTimeout(timeout);

    if (!audioResponse.ok && audioResponse.status !== 206) {
        return new Response("Failed to fetch voice audio", { status: 502 });
    }

    const contentType = audioResponse.headers.get("content-type") || "audio/wav";

    const responseHeaders: Record<string, string> = {
        "Content-Type": contentType,
        "Cache-Control": voice.variant === "SYSTEM" ? "public, max-age=86400" : "private, max-age=3600",
    };

    const contentRange = audioResponse.headers.get("content-range");
    const acceptRanges = audioResponse.headers.get("accept-ranges");
    const contentLength = audioResponse.headers.get("content-length");
    if (contentRange) responseHeaders["Content-Range"] = contentRange;
    if (acceptRanges) responseHeaders["Accept-Ranges"] = acceptRanges;
    if (contentLength) responseHeaders["Content-Length"] = contentLength;

    return new Response(audioResponse.body, {
        status: audioResponse.status === 206 ? 206 : 200,
        headers: responseHeaders,
    })
};