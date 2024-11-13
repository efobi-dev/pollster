import * as z from "zod";
import {
	type CompleteContest,
	type CompleteContestant,
	type CompleteUser,
	relatedContestModel,
	relatedContestantModel,
	relatedUserModel,
} from "./index";

export const voteModel = z.object({
	id: z.string(),
	userId: z.string(),
	contestId: z.string(),
	contestantId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export interface CompleteVote extends z.infer<typeof voteModel> {
	user: CompleteUser;
	contest: CompleteContest;
	candidate: CompleteContestant;
}

/**
 * relatedVoteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedVoteModel: z.ZodSchema<CompleteVote> = z.lazy(() =>
	voteModel.extend({
		user: relatedUserModel,
		contest: relatedContestModel,
		candidate: relatedContestantModel,
	}),
);
