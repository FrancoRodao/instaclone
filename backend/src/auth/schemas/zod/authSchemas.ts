import { z } from 'zod'
import { globalContainerTypes, dependencyContainer } from '../../../common/IOC'
import { I18NService } from '../../../common/i18n/i18n'

const I18NServiceInstance = dependencyContainer.resolve<I18NService>(globalContainerTypes.I18NService)

// TODO: translate everything else
export const zodSignUpSchemaFactory = () => z.object({
  body: z.object({
    fullName: z
      .string()
      .min(5, { message: I18NServiceInstance.translate('errors.{{FIELD}}MustHaveAtLeast{{X}}Characters', { FIELD: I18NServiceInstance.translate('fullName'), X: 5 }) }),

    email: z
      .string()
      .min(1, { message: 'email is required' })
      .email({ message: 'invalid email format' }),

    password: z
      .string()
      .min(5, { message: 'password must have at least 5 characters' })
  })
})

export const zodSignInSchemaFactory = () => z.object({
  body: z.object({
    email: z
      .string()
      .min(1, { message: 'email is required' })
      .email({ message: 'invalid email format' }),

    password: z
      .string()
      .min(5, { message: 'password must have at least 5 characters' })
  })
})
