import { Server } from 'http'
import { Application, NextFunction, Request, Response, Router, json } from 'express'
import { logger } from '../../../utils'
import { IHttpServer } from '../interfaces'
import { ExpressRouterAdapter } from './expressRouter.common'
import { errorHandler } from '../../errors/errorHandler.common'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import { isProductionENV } from '../../../utils/environments'
import { APIVersion } from '../../APIVersions/APIVersion.common'

export class ExpressServerAdapter implements IHttpServer<Router> {
  // used to shut down the server (useful for testing)
  private server!: Server

  // TODO: INJECT LOGGER IN ANYWHERE THAT IS USED
  // TODO: INJECT ERROR HANDLER IN ANYWHERE THAT IS USED
  constructor (private app: Application) {
    this.app = app
  }

  createRouter (name: string) {
    return new ExpressRouterAdapter(name, Router())
  }

  useRouter (path: string, router: ExpressRouterAdapter) {
    this.app.use(path, router.getRoutes())
  }

  init (port: number, apiVersion: APIVersion) {
    if (!Number(port)) {
      logger.error('Server port number is required')
      process.exit(0)
    }

    /*
    The order in which it is declared matters
    - First load the middlewares
    - Second load the routes
    - lastly load the error handler
    */
    this.loadMiddlewares()
    apiVersion.configureRoutes()
    this.useMiddleware(this.errorHandlerMiddleware)

    const runningMessage = `Server running at http://localhost:${port} 🚀`
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).send(runningMessage)
    })

    this.server = this.app.listen(port)
    logger.info(runningMessage)
  }

  // useful for testing
  close () {
    if (this.server) {
      this.server.close()
    }
  }

  private errorHandlerMiddleware (error: Error, req: Request, res: Response, next: NextFunction): void {
    if (!errorHandler.isTrustedError(error)) {
      const { ok, status, errors } = errorHandler.handleUnexpectedError(error)

      res.status(status).json({
        ok,
        status,
        /* Don't expose (possibly sensitive) information about the error */
        errors: isProductionENV ? { data: { msg: 'Internal server error' } } : errors
      })

      return
    }

    // @ts-ignore-line always is a TrustedError (base error)
    const { ok, status, errors } = errorHandler.handleTrustedError(error)

    res.status(status).json({
      ok,
      status,
      errors
    })
  }

  // TODO: FIX ANY TYPE
  private useMiddleware (middleware: any): void {
    this.app.use(middleware)
  }

  private loadMiddlewares () {
    this.useMiddleware(cors())
    this.useMiddleware(isProductionENV ? morgan('combined') : morgan('dev'))
    this.useMiddleware(compression())
    this.useMiddleware(helmet())
    this.useMiddleware(json())
  }
}
