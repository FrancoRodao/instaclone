import { dependencyContainer } from '../../common/IOC/global.container'
import { usersContainerTypes } from '../../common/IOC/types'
import { SequelizeUserRepository, IUserRepository } from '../repositories/users.repository'

export function loadUsersContainer () {
  // repos
  dependencyContainer.register<IUserRepository>(
    usersContainerTypes.UserRepository,
    { useClass: SequelizeUserRepository }
  )
}
