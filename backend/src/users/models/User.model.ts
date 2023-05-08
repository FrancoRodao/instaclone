import bcrypt from 'bcryptjs'
import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../common/database/init.database'
import { Optional } from '../../types/index'
import { IPostModel } from '../../posts/models'
import { IPostCommentModel } from '../../posts/models/postComment.model'
import { IPostLikeModel } from '../../posts/models/postLike.model'

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
  readonly posts?: IPostModel[]
  readonly postLikes?: IPostLikeModel[]
  readonly postComments?: IPostCommentModel
  readonly userFollowers?: IUserModel[]
  readonly userFollowed?: IUserModel[]
}

type UserModelCreationAttributes = Optional<IUserModel, 'id' | 'role'>;

export class SequelizeUserModel extends
  Model<IUserModel, UserModelCreationAttributes> {}

SequelizeUserModel.init({
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
}, {
  sequelize,
  modelName: 'user'
})

// Before save/create any user encrypt password
SequelizeUserModel.beforeCreate('encryptPassword', async (user) => {
  // TODO: ABSTRACT BCRYPT
  const salt = await bcrypt.genSalt(10)
  const userDataValues = user.dataValues
  const hashedPassword = await bcrypt.hash(userDataValues.password, salt)

  user.set('password', hashedPassword)
})
