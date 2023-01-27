import { Request, Response, NextFunction, Router as expressRouter, RequestHandler } from 'express'
import { BaseController, BaseMiddleware } from '../interfaces'
import { IHttpVerbs, BaseRouter } from '../../router/baseRouter.common'

export class ExpressRouterAdapter extends BaseRouter<expressRouter> {
  constructor (public name: string, router: expressRouter) {
    super(name, router)
  }

  protected adaptMiddleware (middleware: BaseMiddleware) {
    return (req: Request, res: Response, next: NextFunction) => {
      middleware.processRequest(req, next)
    }
  }

  protected adaptController (controller: BaseController) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { ok, status, msg } = await controller.processRequest({ body: req.body, params: req.params, headers: req.headers }, next)

        res.status(status).json({
          ok,
          status,
          msg
        })
      } catch (err) {
        next(err)
      }
    }
  }

  protected adaptRoute (verb: IHttpVerbs) {
    return (path: string, middlewares: BaseMiddleware[], controller?: BaseController) => {
      const adaptedExpressMiddlewares: RequestHandler[] = middlewares.map(this.adaptMiddleware)

      if (!controller) {
        this.router[verb](path, ...adaptedExpressMiddlewares)
        return
      }

      this.router[verb](path, ...adaptedExpressMiddlewares.concat(this.adaptController(controller)))
    }
  }

  public get (path: string, middlewares: BaseMiddleware[], controller: BaseController) {
    this.adaptRoute('get')(path, middlewares, controller)
  }

  public post (path: string, middlewares: BaseMiddleware[], controller: BaseController) {
    this.adaptRoute('post')(path, middlewares, controller)
  }

  public put (path: string, middlewares: BaseMiddleware[], controller: BaseController) {
    this.adaptRoute('put')(path, middlewares, controller)
  }

  public delete (path: string, middlewares: BaseMiddleware[], controller: BaseController) {
    this.adaptRoute('delete')(path, middlewares, controller)
  }

  public patch (path: string, middlewares: BaseMiddleware[], controller: BaseController) {
    this.adaptRoute('patch')(path, middlewares, controller)
  }

  public getRoutes () {
    return this.router
  }
}
