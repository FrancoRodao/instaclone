import { injectable, inject } from 'tsyringe'
import { usersContainerTypes, globalContainerTypes } from '../../common/IOC/types'
import { IUserDTO } from '../../users/dtos/User.dto'
import { IUserRepository } from '../../users/repositories/users.repository'
import { I18NService } from '../../common/i18n/i18n'

export interface IAuthService{
  findUserByEmail (email: string): Promise<IUserDTO | null>,
  signUp (userDTO: IUserDTO): Promise<IUserDTO>,
  signIn (user: IUserDTO): Promise<{ success: boolean, translatedMsg: string, user: IUserDTO | null }>
}

@injectable()
export class AuthService implements IAuthService {
  private I18NService: I18NService
  private userRepository: IUserRepository

  constructor (
    @inject(globalContainerTypes.I18NService) I18NService: I18NService,
    @inject(usersContainerTypes.UserRepository) userRepository: IUserRepository
  ) {
    this.I18NService = I18NService
    this.userRepository = userRepository
  }

  // MUST BE IN USER SERVICE
  async findUserByEmail (email: string) {
    const user = await this.userRepository.findByEmail(email)

    return user?.transformToUserDto() ?? null
  }

  async signUp (userDTO: IUserDTO) {
    const newUser = await this.userRepository.create(userDTO)

    return newUser.transformToUserDto()
  }

  async signIn (user: IUserDTO): Promise<{ success: boolean; translatedMsg: string; user: IUserDTO | null }> {
    const userFound = await this.userRepository.findByEmail(user.email)

    if (!userFound) {
      return {
        success: false,
        translatedMsg: this.I18NService.translate('errors.UsersDoesntExists'),
        user: null
      }
    }

    const isCorrectPassword = await userFound.isCorrectPassword(user.password, userFound.password)

    if (!isCorrectPassword) {
      return {
        success: false,
        translatedMsg: this.I18NService.translate('errors.InvalidUserCredentials'),
        user: null
      }
    }

    return {
      success: true,
      translatedMsg: 'success',
      user: userFound.transformToUserDto()
    }
  }
}
