import { BaseController } from '../../common/httpServer/interfaces/controller.interface'
import { dependencyContainer, authContainerTypes } from '../../common/IOC'
import { AuthService, IAuthService, AuthTokenService, IAuthTokenService } from '../services/index'
import { SignInController, SignUpController } from '../controllers'

// TODO: STUDY DIFFERENT TYPES OF DI EXAMPLE I18N MUST BE A SINGLETON

export function loadAuthContainer () {
  // services
  dependencyContainer.register<IAuthService>(
    authContainerTypes.AuthService,
    { useClass: AuthService }
  )

  dependencyContainer.register<IAuthTokenService>(
    authContainerTypes.AuthTokenService,
    { useClass: AuthTokenService }
  )

  // controllers
  dependencyContainer.register<BaseController>(
    authContainerTypes.SignUpController,
    { useClass: SignUpController }
  )

  dependencyContainer.register<BaseController>(
    authContainerTypes.SignInController,
    { useClass: SignInController }
  )
}
