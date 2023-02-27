import { BaseController } from '../../common/httpServer/interfaces/controller.interface'
import { dependencyContainer } from '../../common/IOC/global.container'
import { authContainerTypes } from '../../common/IOC/types'
import { AuthService, IAuthService, AuthTokenService, IAuthTokenService } from '../services'
import { SignInController, SignUpController } from '../controllers'
import { Lifecycle } from 'tsyringe'

export function loadAuthContainer () {
  // services
  dependencyContainer.register<IAuthService>(
    authContainerTypes.AuthService,
    { useClass: AuthService },
    { lifecycle: Lifecycle.Singleton }
  )

  dependencyContainer.register<IAuthTokenService>(
    authContainerTypes.AuthTokenService,
    { useClass: AuthTokenService },
    { lifecycle: Lifecycle.Singleton }
  )

  // controllers
  dependencyContainer.register<BaseController>(
    authContainerTypes.SignUpController,
    { useClass: SignUpController },
    { lifecycle: Lifecycle.Singleton }
  )

  dependencyContainer.register<BaseController>(
    authContainerTypes.SignInController,
    { useClass: SignInController },
    { lifecycle: Lifecycle.Singleton }
  )
}
