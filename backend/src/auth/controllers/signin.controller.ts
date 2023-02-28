import { injectable, inject } from 'tsyringe'
import { authContainerTypes } from '../../common/IOC/types'
import { BaseController, IControllerRequest, IControllerResponse, INextFunction, HttpStatusCodes } from '../../common/httpServer/interfaces'
import { IUserDTO } from '../../users/dtos/User.dto'
import { BadRequestError } from '../../common/errors/errors.common'
import { IAuthService } from '../services'

@injectable()
export class SignInController extends BaseController {
  private authService: IAuthService

  constructor (
        @inject(authContainerTypes.AuthService) authService: IAuthService
  ) {
    super()

    this.authService = authService
  }

  async processRequest (req: IControllerRequest, next: INextFunction): Promise<IControllerResponse | void> {
    // schema validated
    const user = req.body as IUserDTO

    const { success, user: userData, translatedMsg } = await this.authService.signIn(user)

    if (!success || !userData) {
      throw new BadRequestError({ msg: translatedMsg })
    }

    if (userData) {
      // don't send password
      const { password, ...userDataWithOutPassword } = userData

      return {
        status: HttpStatusCodes.OK,
        ok: true,
        msg: {
          user: {
            ...userDataWithOutPassword
          }
        }
      }
    }
  }
}
