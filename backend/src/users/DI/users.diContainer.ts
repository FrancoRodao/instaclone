import { GlobalDIContainer } from '../../common/DI/global.diContainer'
import { usersDITypes } from './users.diTypes'
import { SequelizeUserRepository, IUserRepository } from '../repositories'
import { IUserService, UserService } from '../services/users.service'
import { Lifecycle } from 'tsyringe'

export function loadUsersDIContainer () {
  // services
  GlobalDIContainer.register<IUserService>(
    usersDITypes.UserService,
    { useClass: UserService },
    { lifecycle: Lifecycle.Singleton }
  )

  // repos
  GlobalDIContainer.register<IUserRepository>(
    usersDITypes.UserRepository,
    { useClass: SequelizeUserRepository },
    { lifecycle: Lifecycle.Singleton }
  )
}
