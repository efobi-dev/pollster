import * as z from "zod"
import { Status } from "@prisma/client"
import { CompleteUser, relatedUserModel, CompleteContestant, relatedContestantModel, CompleteVote, relatedVoteModel, CompleteInvite, relatedInviteModel } from "./index"

export const contestModel = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  createdAt: z.date(),
  status: z.nativeEnum(Status),
  updatedAt: z.date(),
  userId: z.string(),
})

export interface CompleteContest extends z.infer<typeof contestModel> {
  createdBy: CompleteUser
  contestants: CompleteContestant[]
  votes: CompleteVote[]
  invites: CompleteInvite[]
}

/**
 * relatedContestModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedContestModel: z.ZodSchema<CompleteContest> = z.lazy(() => contestModel.extend({
  createdBy: relatedUserModel,
  contestants: relatedContestantModel.array(),
  votes: relatedVoteModel.array(),
  invites: relatedInviteModel.array(),
}))
