import { container, Lifecycle } from 'tsyringe'
import { globalDITypes } from './global.diTypes'
import { loadAuthContainer } from '../../auth/DI/auth.diContainer'
import { loadUsersDIContainer } from '../../users/DI/users.diContainer'
import { I18NNextService, I18NService } from '../i18n/i18n'
import { TranslationMiddleware, BaseMiddleware } from '../middlewares'
import { loadProfileContainer } from '../../profile/DI/profile.diContainer'

export const GlobalDIContainer = container

function loadGlobalDIContainer () {
  GlobalDIContainer.register<I18NService>(
    globalDITypes.I18NService,
    { useClass: I18NNextService },
    { lifecycle: Lifecycle.Singleton }
  )

  GlobalDIContainer.register<BaseMiddleware>(
    globalDITypes.TranslationMiddleware,
    { useClass: TranslationMiddleware },
    { lifecycle: Lifecycle.Singleton }
  )
}

export function loadDIContainers () {
  loadGlobalDIContainer()
  loadAuthContainer()
  loadUsersDIContainer()
  loadProfileContainer()
}
