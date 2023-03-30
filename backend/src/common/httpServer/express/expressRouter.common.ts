import fs from 'fs'
import { resolveRefs } from 'json-refs'
import YAML from 'js-yaml'
import swaggerUI from 'swagger-ui-express'
import { Request, Response, NextFunction, Router as expressRouter, RequestHandler } from 'express'
import { BaseController, BaseMiddleware } from '../interfaces'
import { IHttpVerbs, BaseRouter } from '../../router/baseRouter.common'
import { UnexpectedError } from '../../errors/errors.common'

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
        const controllerResponse = await controller.processRequest({ body: req.body, params: req.params, headers: req.headers }, next)

        if (controllerResponse) {
          const { ok, status, msg } = controllerResponse

          return res.status(status).json({
            ok,
            status,
            msg
          })
        }

        throw new UnexpectedError({
          msg: 'Time out',
          info: 'No response has been receive from the controller, check controller response'
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

  public all (path: string, middlewares: BaseMiddleware[]) {
    this.adaptRoute('all')(path, middlewares)
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

  public swagger (routePath: string, swaggerDocumentAbsolutePath: string): void {
    function yamlContentProcessor (res: { text: string }, callback: (err: Error | undefined, done: Object | unknown) => void) {
      callback(undefined, YAML.load(res.text))
    }

    /*
      The default references in swagger are not very flexible,
      that is why I think it is better to use json-refs
      to avoid as much as possible the duplication of text
      in swagger files.
    */
    async function getSwaggerDocWithRefs (rootFilePath: string) {
      const rootSwaggerDoc = YAML.load(fs.readFileSync(rootFilePath).toString()) as Object
      const swaggerDoc = await resolveRefs(rootSwaggerDoc, {
        location: rootFilePath,
        loaderOptions: {
          processContent: yamlContentProcessor
        }
      })

      return swaggerDoc.resolved
    }

    getSwaggerDocWithRefs(swaggerDocumentAbsolutePath).then(swaggerDocResolved => {
      this.router.use(routePath, swaggerUI.serveFiles(swaggerDocResolved), swaggerUI.setup(swaggerDocResolved))
    })
  }

  public getRoutes () {
    return this.router
  }
}
