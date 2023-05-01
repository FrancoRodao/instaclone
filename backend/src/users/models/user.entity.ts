import bcrypt from 'bcryptjs'
import { IUserDTO } from '../dtos/User.dto'
import { isTestENV } from '../../utils/environments'
import { IUserModel, IRoles } from './user.model'

export class UserEntity implements IUserModel {
  public readonly id: string
  public readonly fullName: string
  public readonly email: string
  public readonly password: string
  public readonly role: IRoles

  constructor (
    { id, fullName, email, password, role }: IUserModel
  ) {
    this.id = id
    this.fullName = fullName
    this.email = email
    this.password = password
    this.role = role
  }

  public transformToUserDto (): IUserDTO {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }
  }

  public async isCorrectPassword (password: string): Promise<Boolean> {
    // passwords are not encrypted in test env
    if (isTestENV) return password === this.password

    // TODO: abstract bcrypt
    return await bcrypt
      .compare(password, this.password)
      .then(res => res)
      .catch(err => {
        throw err
      })
  }
}
