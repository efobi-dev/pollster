import * as z from "zod";

export const verificationModel = z.object({
	id: z.string(),
	identifier: z.string(),
	value: z.string(),
	expiresAt: z.date(),
});
