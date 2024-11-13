import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		BETTER_AUTH_SECRET: z.string(),
		GOOGLE_CLIENT_ID: z.string(),
		GOOGLE_CLIENT_SECRET: z.string(),
		SMTP_KEY: z.string(),
		EMAIL_FROM: z.string().email(),
		SMTP_SERVER_HOST: z.string(),
		SMTP_SERVER_USER: z.string().email(),
	},
	client: {
		NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		SMTP_KEY: process.env.SMTP_KEY,
		EMAIL_FROM: process.env.EMAIL_FROM,
		SMTP_SERVER_HOST: process.env.SMTP_SERVER_HOST,
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
		SMTP_SERVER_USER: process.env.SMTP_SERVER_USER,
	},
});
