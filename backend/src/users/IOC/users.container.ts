import { dependencyContainer } from '../../common/IOC/global.container'
import { usersContainerTypes } from '../../common/IOC/types'
import { SequelizeUserRepository, IUserRepository } from '../repositories'
import { IUserService, UserService } from '../services/users.service'
import { Lifecycle } from 'tsyringe'

export function loadUsersContainer () {
  // services
  dependencyContainer.register<IUserService>(
    usersContainerTypes.UserService,
    { useClass: UserService },
    { lifecycle: Lifecycle.Singleton }
  )

  // repos
  dependencyContainer.register<IUserRepository>(
    usersContainerTypes.UserRepository,
    { useClass: SequelizeUserRepository },
    { lifecycle: Lifecycle.Singleton }

  )
}
