import { IUserDTO } from '../dtos/User.dto'
import { UserEntity } from '../models'

export interface IUserRepository{
    store(userDTO: IUserDTO): Promise<UserEntity>,
    getByEmail(email: string): Promise<UserEntity | null>,
}
