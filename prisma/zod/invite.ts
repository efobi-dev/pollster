import * as z from "zod"
import { InviteStatus } from "@prisma/client"
import { CompleteUser, relatedUserModel, CompleteContest, relatedContestModel } from "./index"

export const inviteModel = z.object({
  id: z.string(),
  inviterId: z.string(),
  invitedId: z.string().nullish(),
  invitedEmail: z.string(),
  contestId: z.string(),
  status: z.nativeEnum(InviteStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteInvite extends z.infer<typeof inviteModel> {
  inviter: CompleteUser
  invited?: CompleteUser | null
  contest: CompleteContest
}

/**
 * relatedInviteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedInviteModel: z.ZodSchema<CompleteInvite> = z.lazy(() => inviteModel.extend({
  inviter: relatedUserModel,
  invited: relatedUserModel.nullish(),
  contest: relatedContestModel,
}))
