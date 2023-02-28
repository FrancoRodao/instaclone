import { injectable, inject } from 'tsyringe'
import { authContainerTypes } from '../../common/IOC/types'
import { BaseController, IControllerRequest, IControllerResponse, INextFunction, HttpStatusCodes } from '../../common/httpServer/interfaces'
import { IUserDTO } from '../../users/dtos/User.dto'
import { BadRequestError } from '../../common/errors/errors.common'
import { IAuthService } from '../services'

@injectable()
export class SignUpController extends BaseController {
  private authService: IAuthService

  constructor (
    @inject(authContainerTypes.AuthService) authService: IAuthService

  ) {
    super()

    this.authService = authService
  }

  async processRequest (req: IControllerRequest, next: INextFunction): Promise<IControllerResponse | void> {
    // the user is already sanitized (by middleware)
    const user = req.body as IUserDTO

    const { success, translatedMsg, user: newUser } = await this.authService.signUp(user)

    if (!success || !newUser) {
      throw new BadRequestError({ msg: translatedMsg })
    }

    if (newUser) {
      // don't send password
      const { password, ...userData } = newUser

      return {
        status: HttpStatusCodes.CREATED,
        ok: true,
        msg: {
          user: userData
        }
      }
    }
  }
}
