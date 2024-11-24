import * as z from "zod"
import { CompleteUser, relatedUserModel } from "./index"

export const sessionModel = z.object({
  id: z.string(),
  expiresAt: z.date(),
  ipAddress: z.string().nullish(),
  userAgent: z.string().nullish(),
  userId: z.string(),
})

export interface CompleteSession extends z.infer<typeof sessionModel> {
  user: CompleteUser
}

/**
 * relatedSessionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSessionModel: z.ZodSchema<CompleteSession> = z.lazy(() => sessionModel.extend({
  user: relatedUserModel,
}))
