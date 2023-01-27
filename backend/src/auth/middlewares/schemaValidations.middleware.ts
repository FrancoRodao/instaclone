import { ZodSchemaValidatorMiddleware } from '../../common/schemas/schemaValidators.common'
import { zodSignUpSchemaFactory, zodSignInSchemaFactory } from '../schemas/zod/authSchemas'

export const signUpSchemaValidationMiddleware = new ZodSchemaValidatorMiddleware(zodSignUpSchemaFactory)
export const signInSchemaValidationMiddleware = new ZodSchemaValidatorMiddleware(zodSignInSchemaFactory)
