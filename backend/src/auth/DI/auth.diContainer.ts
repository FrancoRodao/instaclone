import { BaseController } from '../../common/httpServer/interfaces/controller.interface'
import { authDITypes } from './auth.diTypes'
import { GlobalDIContainer } from '../../common/DI/global.diContainer'
import { AuthService, IAuthService, AuthTokenService, IAuthTokenService } from '../services'
import { SignInController, SignUpController } from '../controllers'
import { Lifecycle } from 'tsyringe'

export function loadAuthContainer () {
  // services
  GlobalDIContainer.register<IAuthService>(
    authDITypes.AuthService,
    { useClass: AuthService },
    { lifecycle: Lifecycle.Singleton }
  )

  GlobalDIContainer.register<IAuthTokenService>(
    authDITypes.AuthTokenService,
    { useClass: AuthTokenService },
    { lifecycle: Lifecycle.Singleton }
  )

  // controllers
  GlobalDIContainer.register<BaseController>(
    authDITypes.SignUpController,
    { useClass: SignUpController },
    { lifecycle: Lifecycle.Singleton }
  )

  GlobalDIContainer.register<BaseController>(
    authDITypes.SignInController,
    { useClass: SignInController },
    { lifecycle: Lifecycle.Singleton }
  )
}
