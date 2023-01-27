import { injectable } from 'tsyringe'
import { IUserDTO } from '../dtos/User.dto'
import { UserModel } from '../models/index.model'

export interface IUserRepository{
  create(userDTO: IUserDTO): Promise<UserModel>,
  findByEmail(email: string): Promise<UserModel | null>
}

@injectable()
export class SequelizeUserRepository implements IUserRepository {
  constructor () {}

  async create (userDTO: IUserDTO): Promise<UserModel> {
    const newUser = await UserModel.create(userDTO)

    return newUser
  }

  async findByEmail (email: string): Promise<UserModel | null> {
    const userFound = await UserModel.findOne({
      where: { email }
    })

    if (userFound) return userFound

    return null
  }
}
