import { DataTypes, Model, Optional } from 'sequelize'
import { IUserModel } from '../../users/models'
import { IPostCommentModel } from './postComment.model'
import { IPostLikeModel } from './postLike.model'
import { sequelize } from '../../common/database/init.database'

export interface IPostModel{
  readonly id: string
  readonly userAuthorId: string
  readonly description: string
  readonly images: string[]
  readonly comments?: IPostCommentModel
  readonly likes?: IPostLikeModel[]
  readonly usersTagged?: IUserModel[]
}

type PostModelCreationAttributes = Optional<IPostModel, 'id'>;

export class SequelizePostModel extends
  Model<IPostModel, PostModelCreationAttributes> {}

SequelizePostModel.init({
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
  },
  userAuthorId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  sequelize,
  modelName: 'post'
})
