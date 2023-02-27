import { container, Lifecycle } from 'tsyringe'
import { globalContainerTypes } from './types'
import { loadAuthContainer } from '../../auth/IOC/auth.container'
import { loadUsersContainer } from '../../users/IOC/users.container'
import { I18NNextService, I18NService } from '../i18n/i18n'
import { TranslationMiddleware, BaseMiddleware } from '../middlewares'

export const dependencyContainer = container

function loadGlobalContainer () {
  dependencyContainer.register<I18NService>(
    globalContainerTypes.I18NService,
    { useClass: I18NNextService },
    { lifecycle: Lifecycle.Singleton }
  )

  dependencyContainer.register<BaseMiddleware>(
    globalContainerTypes.TranslationMiddleware,
    { useClass: TranslationMiddleware },
    { lifecycle: Lifecycle.Singleton }
  )
}

export function loadDependencyContainers () {
  loadGlobalContainer()
  loadAuthContainer()
  loadUsersContainer()
}
