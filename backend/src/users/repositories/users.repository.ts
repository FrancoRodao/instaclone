import { injectable } from 'tsyringe'
import { IUserDTO } from '../dtos/User.dto'
import { SequelizeUserModel, UserEntity } from '../models'
import { IUserRepository } from './users.repository.interface'

@injectable()
export class SequelizeUserRepository implements IUserRepository {
  constructor () {}

  async store (userDTO: IUserDTO): Promise<UserEntity> {
    const newUser = await SequelizeUserModel.create(userDTO)

    const userValues = newUser.dataValues

    return new UserEntity(userValues)
  }

  async getByEmail (email: string): Promise<UserEntity | null> {
    const userFound = await SequelizeUserModel.findOne({
      where: { email }
    })

    return userFound ? new UserEntity(userFound.dataValues) : null
  }
}
