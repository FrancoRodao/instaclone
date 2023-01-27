import { IUserDTO } from '../../users/dtos/User.dto'
import { BaseMiddleware, IControllerRequest, INextFunction } from '../../common/httpServer/interfaces'

/*
  sanitizeUser ignore properties that are not useful,
  also the user cannot assign himself an id
*/
class SanitizeUser extends BaseMiddleware {
  processRequest (req: IControllerRequest, next: INextFunction): void {
    const { fullName, email, password } = (req.body as IUserDTO)

    const userSanitized: IUserDTO = {
      fullName,
      email,
      password
    }

    req.body = userSanitized
    next()
  }
}

export const sanitizeUser = new SanitizeUser()
