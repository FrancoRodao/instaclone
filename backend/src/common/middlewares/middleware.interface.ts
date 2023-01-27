import { IControllerRequest, INextFunction } from '../httpServer/interfaces'

export abstract class BaseMiddleware {
  abstract processRequest(req: IControllerRequest, next: INextFunction): void
}
