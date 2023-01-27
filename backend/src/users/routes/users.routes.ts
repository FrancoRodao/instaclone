import { UserController } from '../controllers/index'
import { IHttpServer } from '../../common/httpServer/interfaces'
import { dependencyContainer, globalContainerTypes } from '../../common/IOC/global.container'

export const usersRouter = (app: IHttpServer) => {
  const router = app.createRouter('AuthRoutes')

  const translationMiddleware = dependencyContainer.resolve(globalContainerTypes.TranslationMiddleware)

  router.all('/users/*', [translationMiddleware])

  router.get('/users/me', [], UserController.me)

  return router
}
