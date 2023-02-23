import { injectable, inject } from 'tsyringe'
import { authContainerTypes } from '../../common/IOC'
import { BaseController, IControllerRequest, IControllerResponse, INextFunction } from '../../common/httpServer/interfaces'
import { IUserDTO } from '../../users/dtos/User.dto'
import { BadRequestError, HttpStatusCodes } from '../../common/errors/errors.common'
import { IAuthService, IAuthTokenService } from '../services'

@injectable()
export class SignInController extends BaseController {
  private authService: IAuthService
  private authTokenService: IAuthTokenService

  constructor (
        @inject(authContainerTypes.AuthService) authService: IAuthService,
        @inject(authContainerTypes.AuthTokenService) authTokenService: IAuthTokenService

  ) {
    super()

    this.authService = authService
    this.authTokenService = authTokenService
  }

  async processRequest (req: IControllerRequest, next: INextFunction): Promise<IControllerResponse | void> {
    // schema validated
    const user = req.body as IUserDTO

    const { success, user: userData, translatedMsg } = await this.authService.signIn(user)

    if (!success) {
      throw new BadRequestError({ msg: translatedMsg })
    }

    const { accessToken, refreshToken } = await this.authTokenService.generateAuthToken(user)

    if (userData) {
      // don't send password
      const { password, ...userDataWithOutPassword } = userData

      return {
        status: HttpStatusCodes.OK,
        ok: true,
        msg: {
          user: {
            ...userDataWithOutPassword,
            accessToken,
            refreshToken
          }
        }
      }
    }
  }
}
