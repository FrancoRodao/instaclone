import { DataTypes, ModelDefined } from 'sequelize'
import bcrypt from 'bcryptjs'
import { sequelize } from '../../common/database/init.database'
import { Optional } from '../../types/index'

// IRoles and ROLES must be synchronized, ROLES act as value and IRoles acts as interface
const ROLES = ['USER', 'MODERATOR', 'ADMIN'] as const
export type IRoles = typeof ROLES[number]
export const DEFAULT_USER_ROLE = 'USER'
if (!ROLES.includes(DEFAULT_USER_ROLE)) throw new Error('DEFAULT_USER_ROLE must be in ROLES_ENUMS')

export interface IUserModel{
  readonly id: string
  readonly fullName: string
  readonly email: string
  readonly password: string
  readonly role: IRoles
}

type UserModelCreationAttributes = Optional<IUserModel, 'id' | 'role'>;

// TODO: ADD POSTS TO USER MODEL THINK ABOUT PROPS
export const SequelizeUserModel: ModelDefined<
IUserModel,
UserModelCreationAttributes
> = sequelize.define('User', {
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
    defaultValue: DEFAULT_USER_ROLE
  }
})

// Before save/create any user encrypt password
SequelizeUserModel.beforeCreate('encryptPassword', async (user) => {
  // TODO: ABSTRACT BCRYPT
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(user.dataValues.password, salt)

  user.update({ password: hashedPassword })
})
