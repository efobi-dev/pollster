import type { contestModel } from "@/prisma/zod";
import type { Contest, Contestant, Invite, User, Vote } from "@prisma/client";
import type { z } from "zod";
import type {
	contestSchema,
	inviteSchema,
	signInSchema,
	signUpSchema,
	voteSchema,
} from "./constants";

export type SignUp = z.infer<typeof signUpSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type ZContest = z.infer<typeof contestSchema>;
export type ZInvite = z.infer<typeof inviteSchema>;
export type ZVote = z.infer<typeof voteSchema>;
export type Draft = z.infer<typeof contestModel>;

export interface PartialContest extends Contest {
	votes: Vote[];
	contestants: (Contestant & {
		user: User;
	})[];
}

export interface ContestDetails extends Contest {
	contestants: (Contestant & { user: User; votes: Vote[] })[];
	votes: Vote[];
	createdBy: User;
	invites: Invite[];
}

export interface InviteInfo extends Invite {
	contest: Contest & {
		contestants: Contestant[];
	};
}
