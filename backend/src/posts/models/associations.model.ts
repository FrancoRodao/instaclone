import { SequelizeUserTaggedInPostModel } from './userTaggedInPost.model'
import { SequelizeUserModel } from '../../users/models/user.model'
import { SequelizePostModel } from './post.model'
import { SequelizePostCommentModel } from './postComment.model'
import { SequelizePostLikeModel } from './postLike.model'

export function sequelizePostAssociations () {
  // post associations
  SequelizePostModel.hasMany(SequelizePostCommentModel)
  SequelizePostModel.hasMany(SequelizePostLikeModel)
  SequelizePostModel.belongsToMany(SequelizeUserModel, {
    through: SequelizeUserTaggedInPostModel,
    as: 'usersTagged'
  })

  // post comment associations
  SequelizePostCommentModel.belongsTo(SequelizeUserModel)
  SequelizePostCommentModel.belongsTo(SequelizePostModel)

  // post like associations
  SequelizePostLikeModel.belongsTo(SequelizeUserModel)
  SequelizePostLikeModel.belongsTo(SequelizePostModel)
}
