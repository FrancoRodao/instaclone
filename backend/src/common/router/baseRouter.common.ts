import { RequestHandler } from 'express'
import { BaseController, BaseMiddleware } from '../httpServer/interfaces'
import { logger } from '../../utils/logger'

export type IHttpVerbs = 'get' |'post' |'put'|'patch'|'delete' | 'all'

export abstract class BaseRouter<Router> {
  constructor (public name: string, protected readonly router: Router) {
    this.name = name
    this.router = router
    logger.info(`${name} router initialized`)
  }

  protected abstract adaptMiddleware(middleware: BaseMiddleware): RequestHandler
  protected abstract adaptController(controller: BaseController): RequestHandler

  /* adapts the route and inserts it into router */
  protected abstract adaptRoute(verb: IHttpVerbs): (path: string, middlewares: BaseMiddleware[], controller: BaseController) => void

  public abstract all(path: string, middlewares: BaseMiddleware[]): void
  public abstract get(path: string, middlewares: BaseMiddleware[], controller: BaseController): void
  public abstract post(path: string, middlewares: BaseMiddleware[], controller: BaseController): void
  public abstract put(path: string, middlewares: BaseMiddleware[], controller: BaseController): void
  public abstract patch(path: string, middlewares: BaseMiddleware[], controller: BaseController): void
  public abstract delete(path: string, middlewares: BaseMiddleware[], controller: BaseController): void

  public abstract getRoutes(): Router
}
