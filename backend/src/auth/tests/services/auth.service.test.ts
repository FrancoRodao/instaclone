import 'reflect-metadata' // required for tsyringe
import { AuthService } from '../../services'
import { userServiceMock, I18NServiceMock, tokenServiceMock } from './authServiceMocks'
import { IUserDTO } from '../../../users/dtos/User.dto'

describe('Testing Auth Service', () => {
  const authServiceMock = new AuthService(I18NServiceMock, userServiceMock, tokenServiceMock)
  jest.spyOn(tokenServiceMock, 'generateAuthToken').mockResolvedValue({
    accessToken: 'accessToken123',
    refreshToken: 'refreshToken123'
  })

  const userDTO: IUserDTO = {
    email: 'franco@gmail.com',
    fullName: 'Franco',
    password: 'omega super secret password'
  }

  describe('Testing signup method', () => {
    test('should signup a new user and generate access and refresh tokens', async () => {
      jest.spyOn(userServiceMock, 'isUserExists').mockResolvedValueOnce(false)
      jest.spyOn(userServiceMock, 'create').mockResolvedValueOnce(userDTO)

      const { success, user, translatedMsg } = await authServiceMock.signUp(userDTO)

      expect(success).toBe(true)
      expect(user).toMatchObject(userDTO)
      expect(user?.accessToken).toBeDefined()
      expect(user?.refreshToken).toBeDefined()
      expect(translatedMsg).toBeDefined()
    })

    test('should not create an user with an email that already exists', async () => {
      jest.spyOn(userServiceMock, 'isUserExists').mockResolvedValueOnce(true)

      const { success, user, translatedMsg } = await authServiceMock.signUp(userDTO)

      expect(success).toBe(false)
      expect(user).toBeNull()
      expect(translatedMsg).toBeDefined()
    })
  })

  describe('Testing signin method', () => {
    test('should sign in an user, returning user info, access and refresh tokens', async () => {
      jest.spyOn(userServiceMock, 'areValidUserCredentials').mockResolvedValueOnce(userDTO)

      const { success, translatedMsg, user } = await authServiceMock.signIn(userDTO)

      expect(success).toBe(true)
      expect(translatedMsg).toBeDefined()
      expect(user).toMatchObject(userDTO)
      expect(user?.accessToken).toBeDefined()
      expect(user?.refreshToken).toBeDefined()
    })

    test('should not register a user who does not exist or whose credentials are incorrect.', async () => {
      jest.spyOn(userServiceMock, 'areValidUserCredentials').mockResolvedValueOnce(null)

      const { success, user, translatedMsg } = await authServiceMock.signIn(userDTO)

      expect(success).toBe(false)
      expect(user).toBeNull()
      expect(translatedMsg).toBeDefined()
    })
  })
})
