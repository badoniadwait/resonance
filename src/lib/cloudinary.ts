import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

type UploadAudioOptions = {
  buffer: Buffer;
  key: string;
};

export async function uploadAudio({
  buffer,
  key,
}: UploadAudioOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: key,
        resource_type: "video", // Cloudinary stores audio as video
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);

        resolve(result!.public_id);
      },
    );

    stream.end(buffer);
  });
}

export async function deleteAudio(key: string): Promise<void> {
  await cloudinary.uploader.destroy(key, {
    resource_type: "video",
  });
}

export async function getSignedAudioUrl(key: string): Promise<string> {
  return cloudinary.url(key, {
    resource_type: "video",
    sign_url: true,
    secure: true,
  });
}