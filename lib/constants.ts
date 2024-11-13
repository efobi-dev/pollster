import { z } from "zod";

export const signUpSchema = z.object({
	name: z
		.string()
		.min(3, { message: "Your name must be at least 3 characters" }),
	email: z.string().email(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(32, { message: "Password must be a max of 32 characters" }),
});

export const signInSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(32, { message: "Password must be a max of 32 characters" }),
});

export const contestSchema = z
	.object({
		title: z.string().min(2, {
			message: "Title must be at least 2 characters.",
		}),
		description: z.string().min(10, {
			message: "Description must be at least 10 characters.",
		}),
		startDate: z.date({
			required_error: "A start date is required.",
		}),
		endDate: z.date({
			required_error: "An end date is required.",
		}),
	})
	.refine((data) => data.endDate > data.startDate, {
		message: "End date must be after start date.",
		path: ["endDate"],
	});

export const inviteSchema = z.object({
	invitedEmail: z.string().email(),
	inviterId: z.string(),
	contestId: z.string(),
	contestName: z.string(),
});

export const voteSchema = z.object({
	contestId: z.string(),
	contestantId: z.string(),
});
