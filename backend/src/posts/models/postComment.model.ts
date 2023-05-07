import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../../common/database/init.database'

export interface IPostCommentModel {
  readonly userId: string,
  readonly postId: string
  readonly commentBody: string
}

export class SequelizePostCommentModel extends
  Model<IPostCommentModel, IPostCommentModel> {}

SequelizePostCommentModel.init({
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  commentBody: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'postComment'
})
