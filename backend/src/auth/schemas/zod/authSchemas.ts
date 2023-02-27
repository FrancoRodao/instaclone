import { z } from 'zod'
import { dependencyContainer } from '../../../common/IOC/global.container'
import { globalContainerTypes } from '../../../common/IOC/types'
import { I18NService } from '../../../common/i18n/i18n'

// TODO: translate everything else
export const zodSignUpSchemaFactory = () => {
  const I18NServiceInstance = dependencyContainer.resolve<I18NService>(globalContainerTypes.I18NService)

  return z.object({
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
}

export const zodSignInSchemaFactory = () => {
  // const I18NServiceInstance = dependencyContainer.resolve<I18NService>(globalContainerTypes.I18NService)

  return z.object({
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
}
