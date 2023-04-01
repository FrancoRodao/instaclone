import path from 'path'
import { globalContainerTypes, authContainerTypes } from '../../common/IOC/types'
import { dependencyContainer } from '../../common/IOC/global.container'
import { signUpSchemaValidationMiddleware, sanitizeUser } from '../middlewares'
import { BaseMiddleware } from '../../common/middlewares'
import { IHttpServer } from '../../common/httpServer/interfaces'
import { signInSchemaValidationMiddleware } from '../middlewares/schemaValidations.middleware'

export const authRouter = (app: IHttpServer) => {
  const router = app.createRouter('AuthRoutes')

  const translationMiddleware = dependencyContainer.resolve<BaseMiddleware>(globalContainerTypes.TranslationMiddleware)

  router.all('/auth/*', [translationMiddleware])

  router.post(
    '/auth/signup',
    [signUpSchemaValidationMiddleware, sanitizeUser],
    dependencyContainer.resolve(authContainerTypes.SignUpController)
  )

  router.post(
    '/auth/signin',
    [signInSchemaValidationMiddleware],
    dependencyContainer.resolve(authContainerTypes.SignInController)
  )

  /* DOCUMENTATION */
  router.swagger('/docs/auth', path.resolve(__dirname, '../docs/v1/auth.swagger.yaml'))

  return router
}
