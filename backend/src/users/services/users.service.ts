import { inject, injectable } from 'tsyringe'
import { IUserDTO } from '../dtos/User.dto'
import { usersContainerTypes } from '../../common/IOC/types'
import { IUserRepository } from '../repositories'

export interface IUserService{
  create(userDTO: IUserDTO): Promise<IUserDTO>,
  isUserExists(email: string): Promise<boolean>,
  /**
   * Returns the user if credentials are correct, otherwise returns null
  */
  areValidUserCredentials(email: string, password: string): Promise<IUserDTO | null>
}

@injectable()
export class UserService implements IUserService {
  private userRepository: IUserRepository

  constructor (
    @inject(usersContainerTypes.UserRepository) userRepository: IUserRepository
  ) {
    this.userRepository = userRepository
  }

  async create (userDTO: IUserDTO): Promise<IUserDTO> {
    const newUser = await this.userRepository.store(userDTO)

    return newUser.transformToUserDto()
  }

  async isUserExists (email: string): Promise<boolean> {
    const exitsUser = await this.userRepository.getByEmail(email)

    if (exitsUser) return true

    return false
  }

  async areValidUserCredentials (email: string, password: string): Promise<IUserDTO | null> {
    const userFound = await this.userRepository.getByEmail(email)
    const isCorrectPassword = await userFound?.isCorrectPassword(password)

    // userFound may not exist (null)
    if (userFound && isCorrectPassword) {
      return userFound.transformToUserDto()
    }

    return null
  }
}
