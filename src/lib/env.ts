import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_URL: z.string().url(),
    DATABASE_URL: z.string().min(1),

    CLERK_SECRET_KEY: z.string().min(1),

    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),

    HF_ACCESS_TOKEN: z.string().min(1),

    CHATTERBOX_API_KEY: z.string().min(1),
    CHATTERBOX_API_URL: z.url(),
    SENTRY_AUTH_TOKEN: z.string().min(1),

    POLAR_ACCESS_TOKEN: z.string().min(1),
    POLAR_SERVER: z.enum(["sandbox", "production"]),
    POLAR_PRODUCT_ID: z.string().uuid(),
  },

  client: {
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },

  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    DATABASE_URL: process.env.DATABASE_URL,

    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,

    NEXT_PUBLIC_CLERK_SIGN_IN_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
      process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

    HF_ACCESS_TOKEN: process.env.HF_ACCESS_TOKEN,

    CHATTERBOX_API_KEY: process.env.CHATTERBOX_API_KEY,
    CHATTERBOX_API_URL: process.env.CHATTERBOX_API_URL,

    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,

    POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
    POLAR_SERVER: process.env.POLAR_SERVER,
    POLAR_PRODUCT_ID: process.env.POLAR_PRODUCT_ID,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});