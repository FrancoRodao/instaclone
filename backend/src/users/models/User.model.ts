import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { database } from '../../common/database/init.database'
import bcrypt from 'bcryptjs'
import { IUserDTO } from '../dtos/User.dto'

const ROLES = ['USER', 'MODERATOR', 'ADMIN'] as const
export type IRoles = typeof ROLES[number]
export const DEFAULT_ROLE = 'USER'
if (!ROLES.includes(DEFAULT_ROLE)) throw new Error('DEFAULT_ROLE must be in ROLES_ENUMS')

// eslint-disable-next-line no-use-before-define
export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel, { omit: 'id' | 'role' }>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).

  declare id: CreationOptional<string>
  declare fullName: string
  declare email: string
  declare password: string
  declare role: IRoles

  public transformToUserDto (): IUserDTO {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      password: this.password
    }
  }

  public async isCorrectPassword (password: string, hashedPassword: string): Promise<Boolean> {
    return await bcrypt
      .compare(password, hashedPassword)
      .then(res => res)
      .catch(err => {
        throw err
      })
  }
}

// TODO: ADD POSTS TO USER MODEL THINK ABOUT PROPS
UserModel.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM,
    values: ROLES,
    defaultValue: DEFAULT_ROLE
  }
}, {
  sequelize: database,
  tableName: 'User'
})

UserModel.beforeCreate('encryptPassword', async (user: UserModel) => {
  // TODO: ABSTRACT BCRYPT
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(user.password, salt)

  user.password = hashedPassword
})
