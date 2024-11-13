import * as z from "zod";
import {
	type CompleteContest,
	type CompleteUser,
	type CompleteVote,
	relatedContestModel,
	relatedUserModel,
	relatedVoteModel,
} from "./index";

export const contestantModel = z.object({
	id: z.string(),
	userId: z.string(),
	contestId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export interface CompleteContestant extends z.infer<typeof contestantModel> {
	user: CompleteUser;
	contest: CompleteContest;
	votes: CompleteVote[];
}

/**
 * relatedContestantModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedContestantModel: z.ZodSchema<CompleteContestant> = z.lazy(
	() =>
		contestantModel.extend({
			user: relatedUserModel,
			contest: relatedContestModel,
			votes: relatedVoteModel.array(),
		}),
);
