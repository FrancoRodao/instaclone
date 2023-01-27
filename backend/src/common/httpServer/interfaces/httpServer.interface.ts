import { BaseRouter } from '../../router/baseRouter.common'
import { APIVersion } from '../../APIVersions/APIVersion.common'

export interface IHttpServer<Router = unknown>{
    createRouter(name: string): BaseRouter<Router>,
    useRouter(path: string, router: BaseRouter<Router>): void,
    init(port: number, apiVersion: APIVersion): void
}
