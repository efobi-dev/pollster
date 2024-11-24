import * as z from "zod"
import { CompleteUser, relatedUserModel } from "./index"

export const accountModel = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.string().nullish(),
  refreshToken: z.string().nullish(),
  idToken: z.string().nullish(),
  expiresAt: z.date().nullish(),
  password: z.string().nullish(),
})

export interface CompleteAccount extends z.infer<typeof accountModel> {
  user: CompleteUser
}

/**
 * relatedAccountModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedAccountModel: z.ZodSchema<CompleteAccount> = z.lazy(() => accountModel.extend({
  user: relatedUserModel,
}))
