import { injectable, inject } from 'tsyringe'
import { usersContainerTypes, globalContainerTypes, authContainerTypes } from '../../common/IOC/types'
import { IUserDTO } from '../../users/dtos/User.dto'
import { I18NService } from '../../common/i18n/i18n'
import { IUserService } from '../../users/services/users.service'
import { AuthTokens, IAuthTokenService } from './token.service'

type IUserResponse = (IUserDTO & AuthTokens) | null
export interface IAuthService{
  signUp (userDTO: IUserDTO): Promise<{ success: boolean, translatedMsg: string, user: IUserResponse }>,
  signIn (userDTO: IUserDTO): Promise<{ success: boolean, translatedMsg: string, user: IUserResponse }>
}

@injectable()
export class AuthService implements IAuthService {
  private I18NService: I18NService
  private userService: IUserService
  private authTokenService: IAuthTokenService

  constructor (
    @inject(globalContainerTypes.I18NService) I18NService: I18NService,
    @inject(usersContainerTypes.UserService) userService: IUserService,
    @inject(authContainerTypes.AuthTokenService) authTokenService: IAuthTokenService

  ) {
    this.I18NService = I18NService
    this.userService = userService
    this.authTokenService = authTokenService
  }

  async signUp (userDTO: IUserDTO): Promise<{ success: boolean, translatedMsg: string, user: IUserResponse }> {
    const userExists = await this.userService.isUserExists(userDTO.email)

    if (userExists) {
      return {
        success: false,
        translatedMsg: this.I18NService.translate('errors.EmailIsAlreadyRegistered'),
        user: null
      }
    }

    const newUser = await this.userService.create(userDTO)

    const { accessToken, refreshToken } = await this.authTokenService.generateAuthToken(newUser)

    // TODO: ADD TRANSLATION TO SUCCESS MSG
    return {
      success: true,
      translatedMsg: 'successful signup',
      user: {
        ...newUser,
        accessToken,
        refreshToken
      }
    }
  }

  async signIn (userDTO: IUserDTO): Promise<{ success: boolean; translatedMsg: string; user: IUserResponse }> {
    const userFound = await this.userService.areValidUserCredentials(userDTO.email, userDTO.password)

    if (!userFound) {
      return {
        success: false,
        translatedMsg: this.I18NService.translate('errors.InvalidUserCredentials'),
        user: null
      }
    }

    const { accessToken, refreshToken } = await this.authTokenService.generateAuthToken(userFound)

    // TODO: ADD TRANSLATION TO SUCCESS MSG
    return {
      success: true,
      translatedMsg: 'success signin',
      user: {
        ...userFound,
        accessToken,
        refreshToken
      }
    }
  }
}
