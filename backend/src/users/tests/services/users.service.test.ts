
import 'reflect-metadata' // required for tsyringe
import { IUserRepository } from '../../repositories'
import { UserService } from '../../services/users.service'
import { IUserModel, UserEntity } from '../../models'

const mockUserRepository: IUserRepository = {
  store: jest.fn(),
  getByEmail: jest.fn()
}

const userModel: IUserModel = {
  id: '123',
  fullName: 'jhon doe',
  email: 'jhondoe@gmail.com',
  password: '123456password',
  role: 'USER'
}
// this instance does not store anything in the database
const userCreated = new UserEntity(userModel)

const userService = new UserService(mockUserRepository)

describe('Testing User Service', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Testing create method', () => {
    test('should create an user and return an userDTO', async () => {
      jest.spyOn(mockUserRepository, 'store').mockResolvedValueOnce(userCreated)

      const result = await userService.create(userModel)

      expect(mockUserRepository.store).toHaveBeenCalledWith(userModel)
      expect(result).toEqual(userCreated.transformToUserDto())
    })
  })

  describe('Testing isUserExists Method', () => {
    test('should return true if the user exists', async () => {
      const email = userModel.email

      jest.spyOn(mockUserRepository, 'getByEmail').mockResolvedValueOnce(userCreated)

      const result = await userService.isUserExists(email)

      expect(result).toBe(true)
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(email)
    })

    test('should return null if the user does not exist', async () => {
      const email = userModel.email

      jest.spyOn(mockUserRepository, 'getByEmail').mockResolvedValueOnce(null)

      const result = await userService.isUserExists(email)

      expect(result).toBe(false)
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(email)
    })
  })

  describe('Testing areValidUserCredentials method', () => {
    test('should return the userDTO if the credentials are correct', async () => {
      const email = userModel.email
      const password = userModel.password
      // avoid conflict with the expect of userCreated.transformToUserDto toBeCalledTimes
      const userDTO = userCreated.transformToUserDto()

      jest.spyOn(mockUserRepository, 'getByEmail').mockResolvedValueOnce(userCreated)
      jest.spyOn(userCreated, 'isCorrectPassword').mockResolvedValueOnce(true)
      jest.spyOn(userCreated, 'transformToUserDto').mockReturnValueOnce(userDTO)

      const result = await userService.areValidUserCredentials(email, password)

      expect(result).toEqual(userDTO)
      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(email)
      expect(userCreated.isCorrectPassword).toBeCalledTimes(1)
      expect(userCreated.transformToUserDto).toBeCalledTimes(1)
    })

    test('should return null if the password is incorrect', async () => {
      const differentUserModel: IUserModel = {
        ...userModel,
        id: '1234',
        email: 'anotheremail@gmail.com',
        password: 'another password :D'
      }
      const differentUserCreated = new UserEntity(differentUserModel)
      const email = differentUserModel.email

      jest.spyOn(mockUserRepository, 'getByEmail').mockResolvedValueOnce(differentUserCreated)
      jest.spyOn(differentUserCreated, 'isCorrectPassword').mockResolvedValueOnce(false)

      const result = await userService.areValidUserCredentials(email, 'wrong password')

      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(email)
      expect(differentUserCreated.isCorrectPassword).toBeCalledTimes(1)
      expect(result).toEqual(null)
    })

    test('should return null if the user do not exists', async () => {
      const email = userModel.email
      const password = userModel.password

      jest.spyOn(mockUserRepository, 'getByEmail').mockResolvedValueOnce(null)
      jest.spyOn(userCreated, 'isCorrectPassword')

      const result = await userService.areValidUserCredentials(email, password)

      expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(email)
      expect(userCreated.isCorrectPassword).toBeCalledTimes(0)
      expect(result).toEqual(null)
    })
  })
})
