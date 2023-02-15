import { IHttpServer } from '../httpServer/interfaces/httpServer.interface'

export abstract class APIVersion {
  constructor (protected httpServer: IHttpServer) {
    this.httpServer = httpServer
  }

  public abstract getVersion(): number
  public abstract configureRoutes(): void
}
