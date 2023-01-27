import { BaseController, IControllerRequest, IControllerResponse } from '../../common/httpServer/interfaces'
import { UsersService } from '../services/users.service'

class MeController extends BaseController {
  // TODO: INJECT SERVICE
  constructor (/* protected usersService: UsersService */) {
    super()
  }

  async processRequest (req: IControllerRequest): Promise<IControllerResponse> {
    const me = /* this. */UsersService.getMe()

    return {
      status: 200,
      ok: true,
      msg: {
        user: me
      }
    }
  }
}

export const me = new MeController()
