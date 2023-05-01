import { IUserModel } from '../models'
import { Optional } from '../../types'

type IUserWithOutRole = Omit<IUserModel, 'role'>
export type IUserDTO = Optional<IUserWithOutRole, 'id'>
