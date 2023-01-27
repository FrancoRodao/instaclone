import { IHttpServer } from '../httpServer/interfaces/httpServer.interface'
import { logger } from '../../utils/logger'

export abstract class APIVersion {
  constructor (protected httpServer: IHttpServer) {
    logger.info(`API V${this.getVersion()} routes ON`)
  }

  public abstract getVersion(): number
  public abstract configureRoutes(): void
}
