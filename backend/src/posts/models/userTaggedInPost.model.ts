import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../common/database/init.database'
import { SequelizeUserModel } from '../../users/models/user.model'
import { SequelizePostModel } from './post.model'

interface IUserTaggedInPost{
  readonly userId: string
  readonly postId: string
}

export class SequelizeUserTaggedInPostModel extends
  Model<IUserTaggedInPost, IUserTaggedInPost> {}

SequelizeUserTaggedInPostModel.init({
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: SequelizeUserModel,
      key: 'id'
    }
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: SequelizePostModel,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'userTaggedInPost',
  tableName: 'userTaggedInPost'
})
