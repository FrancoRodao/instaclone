import { dependencyContainer, usersContainerTypes } from '../../common/IOC'
import { SequelizeUserRepository, IUserRepository } from '../repositories/users.repository'

export function loadUsersContainer () {
  // repos
  dependencyContainer.register<IUserRepository>(
    usersContainerTypes.UserRepository,
    { useClass: SequelizeUserRepository }
  )
}
