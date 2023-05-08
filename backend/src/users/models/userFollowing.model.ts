import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../../common/database/init.database'
import { SequelizeUserModel } from '../../users/models/user.model'

interface IUserFollowing{
  readonly userId: string
  readonly userFollowedId: string
}

export class SequelizeUserFollowingModel extends
  Model<IUserFollowing, IUserFollowing> {}

SequelizeUserFollowingModel.init({
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: SequelizeUserModel,
      key: 'id'
    }
  },
  userFollowedId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: SequelizeUserModel,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'userFollowing'
})
