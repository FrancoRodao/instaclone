import 'reflect-metadata' // required for tsyringe
import { SignInController } from '../../controllers'
import { IUserDTO } from '../../../users/dtos/User.dto'
import { HttpStatusCodes } from '../../../common/httpServer/interfaces/httpStatusCodes'
import { BadRequestError } from '../../../common/errors/errors.common'
import { IAuthService } from '../../services/auth.service'
import { IControllerRequest } from '../../../common/httpServer/interfaces/controller.interface'

describe('Testing signin controller', () => {
  const authServiceMock: IAuthService = {
    signIn: jest.fn(),
    signUp: jest.fn()
  }

  const signInController = new SignInController(authServiceMock)
  const nextFn = jest.fn()

  const userDTO: IUserDTO = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123'
  }

  const req: IControllerRequest = {
    body: userDTO
  }

  test('should return user info when sign in is successful', async () => {
    const userData = {
      ...userDTO,
      accessToken: 'token123',
      refreshToken: 'refreshToken123'
    }

    jest.spyOn(authServiceMock, 'signIn').mockResolvedValueOnce({
      success: true,
      user: userData,
      translatedMsg: ''
    })

    const processedReq = await signInController.processRequest(req, nextFn)

    expect(processedReq).toEqual({
      status: HttpStatusCodes.OK,
      ok: true,
      msg: {
        user: {
          fullName: userData.fullName,
          email: userData.email,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken
        }
      }
    })
    expect(authServiceMock.signIn).toHaveBeenCalledWith(userDTO)
  })

  test('should throw BadRequestError when credentials are wrong', async () => {
    jest.spyOn(authServiceMock, 'signIn').mockResolvedValueOnce({
      success: true,
      user: null,
      translatedMsg: 'error message'
    })

    const processedReq = signInController.processRequest(req, nextFn)

    expect(processedReq).rejects.toThrowError(BadRequestError)
    expect(authServiceMock.signIn).toHaveBeenCalledWith(userDTO)
  })
})
