import { authRouter } from '../../auth/routes/auth.routes'
// import { usersRouter } from '../../users/routes/users.routes'
import { APIVersion } from './APIVersion.common'

export class APIVersion1 extends APIVersion {
  public getVersion (): number {
    return 1
  }

  public configureRoutes (): void {
    this.httpServer.useRouter('/api/v1', authRouter(this.httpServer))
    // this.httpServer.useRouter('/api/v1', usersRouter(this.httpServer))
  }
}
