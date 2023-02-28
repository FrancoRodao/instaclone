import { injectable } from 'tsyringe'
import { IUserDTO } from '../dtos/User.dto'
import { UserModel } from '../models/index.model'

export interface IUserRepository{
  store(userDTO: IUserDTO): Promise<UserModel>,
  getByEmail(email: string): Promise<UserModel | null>
}

@injectable()
export class SequelizeUserRepository implements IUserRepository {
  constructor () {}

  async store (userDTO: IUserDTO): Promise<UserModel> {
    const newUser = await UserModel.create(userDTO)

    return newUser
  }

  async getByEmail (email: string): Promise<UserModel | null> {
    const userFound = await UserModel.findOne({
      where: { email }
    })

    if (userFound) return userFound

    return null
  }
}
