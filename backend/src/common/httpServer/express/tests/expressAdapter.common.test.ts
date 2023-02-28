import 'reflect-metadata'
import express, { Router } from 'express'
import { ExpressRouterAdapter } from '../expressRouter.common'
import { BaseMiddleware } from '../../../middlewares/middleware.interface'
import { IControllerRequest, INextFunction } from '../../interfaces'
import { BaseController, IControllerResponse } from '../../interfaces/controller.interface'
import { ExpressServerAdapter } from '../expressServer.common'
import { APIVersion } from '../../../APIVersions/APIVersion.common'
import request from 'supertest'

class APIVersionTest extends APIVersion {
  public getVersion (): number {
    return 3
  }

  public configureRoutes (): void {

  }
}

const middlewareFunctionMock = jest.fn()

class BasicMiddleware extends BaseMiddleware {
  processRequest (req: IControllerRequest, next: INextFunction): void {
    middlewareFunctionMock()
    next()
  }
}

class BasicController extends BaseController {
  public processRequest (req: IControllerRequest, next: INextFunction): IControllerResponse | Promise<IControllerResponse> {
    return {
      ok: true,
      msg: 'passed through the basic controller',
      status: 200
    }
  }
}

describe('Testing express router adapter', () => {
  let nativeExpressApp: express.Application
  let expressServerAdapter: ExpressServerAdapter
  let expressTestRouterAdapter: ExpressRouterAdapter
  let nativeExpressRouter: Router

  const pathName = '/testingPathRoute'

  beforeEach(() => {
    nativeExpressApp = express()

    expressServerAdapter = new ExpressServerAdapter(nativeExpressApp)
    expressTestRouterAdapter = expressServerAdapter.createRouter('test router')
    nativeExpressRouter = expressTestRouterAdapter.getRoutes()
  })

  afterEach(() => {
    expressServerAdapter.close()
  })

  test('should adapt testingPathRoute get route to express get route', () => {
    expressTestRouterAdapter.get(pathName, [new BasicMiddleware()], new BasicController())

    // SHOULD BE A GET ROUTE
    expect(nativeExpressRouter.stack[0].route.methods.get).toBe(true)

    // PATH ROUTE NAME
    expect(nativeExpressRouter.stack[0].route.path).toBe(pathName)

    // MIDDLEWARE LAYER AND CONTROLLER LAYER ( 2 )
    expect(nativeExpressRouter.stack[0].route.stack.length).toBe(2)
  })

  test('should adapt testingPathRoute post route to express post route', () => {
    expressTestRouterAdapter.post(pathName, [new BasicMiddleware()], new BasicController())

    // SHOULD BE A POST ROUTE
    expect(nativeExpressRouter.stack[0].route.methods.post).toBe(true)

    // PATH ROUTE NAME
    expect(nativeExpressRouter.stack[0].route.path).toBe(pathName)

    // MIDDLEWARE LAYER AND CONTROLLER LAYER ( 2 )
    expect(nativeExpressRouter.stack[0].route.stack.length).toBe(2)
  })

  test('should adapt testingPathRoute put route to express put route', () => {
    expressTestRouterAdapter.put(pathName, [new BasicMiddleware()], new BasicController())

    // SHOULD BE A PUT ROUTE
    expect(nativeExpressRouter.stack[0].route.methods.put).toBe(true)

    // PATH ROUTE NAME
    expect(nativeExpressRouter.stack[0].route.path).toBe(pathName)

    // MIDDLEWARE LAYER AND CONTROLLER LAYER ( 2 )
    expect(nativeExpressRouter.stack[0].route.stack.length).toBe(2)
  })

  test('should adapt testingPathRoute patch route to express patch route', () => {
    expressTestRouterAdapter.patch(pathName, [new BasicMiddleware()], new BasicController())

    // SHOULD BE A PATCH ROUTE
    expect(nativeExpressRouter.stack[0].route.methods.patch).toBe(true)

    // PATH ROUTE NAME
    expect(nativeExpressRouter.stack[0].route.path).toBe(pathName)

    // MIDDLEWARE LAYER AND CONTROLLER LAYER ( 2 )
    expect(nativeExpressRouter.stack[0].route.stack.length).toBe(2)
  })

  test('should adapt testingPathRoute delete route to express delete route', () => {
    expressTestRouterAdapter.delete(pathName, [new BasicMiddleware()], new BasicController())

    // SHOULD BE A DELETE ROUTE
    expect(nativeExpressRouter.stack[0].route.methods.delete).toBe(true)

    // PATH ROUTE NAME
    expect(nativeExpressRouter.stack[0].route.path).toBe(pathName)

    // MIDDLEWARE LAYER AND CONTROLLER LAYER ( 2 )
    expect(nativeExpressRouter.stack[0].route.stack.length).toBe(2)
  })

  test('should adapt testingPathRoute all route to express all route', () => {
    expressTestRouterAdapter.all(pathName, [new BasicMiddleware()])

    // SHOULD BE A ALL ROUTE
    expect(nativeExpressRouter.stack[0].route.methods._all).toBe(true)

    // PATH ROUTE NAME
    expect(nativeExpressRouter.stack[0].route.path).toBe(pathName)

    // MIDDLEWARE LAYER ( 1 )
    expect(nativeExpressRouter.stack[0].route.stack.length).toBe(1)
  })
})

describe('Testing express server adapter', () => {
  let nativeExpressApp: express.Application
  let expressServerAdapter: ExpressServerAdapter
  let expressTestRouterAdapter: ExpressRouterAdapter

  beforeEach(() => {
    nativeExpressApp = express()

    expressServerAdapter = new ExpressServerAdapter(nativeExpressApp)
    expressTestRouterAdapter = expressServerAdapter.createRouter('test router')

    expressServerAdapter.init(3001, new APIVersionTest(expressServerAdapter))
  })

  afterEach(() => {
    expressServerAdapter.close()
  })

  test('should have initialized the express server', async () => {
    await request(nativeExpressApp)
      .get('/')
      .expect(200)
  })

  test('should be able to access the route /usingRouter/testingPathRoute (testing useRouter method)', async () => {
    expressTestRouterAdapter.get('/testingPathRoute', [new BasicMiddleware()], new BasicController())

    expressServerAdapter.useRouter('/usingRouter', expressTestRouterAdapter)

    const response = await request(nativeExpressApp)
      .get('/usingRouter/testingPathRoute')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(middlewareFunctionMock).toBeCalledTimes(1)
    expect(response.body.ok).toBe(true)
    expect(response.body.msg).toBe('passed through the basic controller')
  })
})
