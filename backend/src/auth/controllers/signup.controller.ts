import { injectable, inject } from 'tsyringe'
import { globalContainerTypes, authContainerTypes } from '../../common/IOC'
import { BaseController, IControllerRequest, IControllerResponse, INextFunction } from '../../common/httpServer/interfaces'
import { I18NService } from '../../common/i18n/i18n'
import { IUserDTO } from '../../users/dtos/User.dto'
import { BadRequestError } from '../../common/errors/errors.common'
import { IAuthService } from '../services'

@injectable()
export class SignUpController extends BaseController {
  private I18NService: I18NService
  private authService: IAuthService

  constructor (
    @inject(authContainerTypes.AuthService) authService: IAuthService,
    @inject(globalContainerTypes.I18NService) I18NService: I18NService

  ) {
    super()

    this.authService = authService
    this.I18NService = I18NService
  }

  async processRequest (req: IControllerRequest, next: INextFunction): Promise<IControllerResponse> {
    // the user is already sanitized (by middleware)
    const user = req.body as IUserDTO

    const existsEmail = await this.authService.findUserByEmail(user.email)

    if (existsEmail) {
      throw new BadRequestError({ msg: this.I18NService.translate('errors.EmailIsAlreadyRegistered') })
    }

    const userCreated = await this.authService.signUp(user)

    // don't send password
    const { password, ...userData } = userCreated

    return {
      status: 201,
      ok: true,
      msg: {
        user: userData
      }
    }
  }
}
