import * as z from "zod";
import {
	type CompleteAccount,
	type CompleteContest,
	type CompleteContestant,
	type CompleteInvite,
	type CompleteSession,
	type CompleteVote,
	relatedAccountModel,
	relatedContestModel,
	relatedContestantModel,
	relatedInviteModel,
	relatedSessionModel,
	relatedVoteModel,
} from "./index";

export const userModel = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	emailVerified: z.boolean(),
	image: z.string().nullish(),
});

export interface CompleteUser extends z.infer<typeof userModel> {
	contests: CompleteContest[];
	contestantIn: CompleteContestant[];
	votes: CompleteVote[];
	Account: CompleteAccount[];
	Session: CompleteSession[];
	sentInvites: CompleteInvite[];
	receivedInvites: CompleteInvite[];
}

/**
 * relatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
	userModel.extend({
		contests: relatedContestModel.array(),
		contestantIn: relatedContestantModel.array(),
		votes: relatedVoteModel.array(),
		Account: relatedAccountModel.array(),
		Session: relatedSessionModel.array(),
		sentInvites: relatedInviteModel.array(),
		receivedInvites: relatedInviteModel.array(),
	}),
);
