import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../common/database/init.database'

export interface IPostLikeModel{
  readonly userId: string
  readonly postId: string
}

export class SequelizePostLikeModel extends
  Model<IPostLikeModel, IPostLikeModel> {}

SequelizePostLikeModel.init({
  userId: {
    type: DataTypes.UUID
  },
  postId: {
    type: DataTypes.UUID
  }
}, {
  sequelize,
  modelName: 'postLike'
})
