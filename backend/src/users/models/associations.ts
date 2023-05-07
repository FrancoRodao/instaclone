import { SequelizeUserModel } from './user.model'
import { SequelizePostModel } from '../../posts/models/post.model'
import { SequelizeUserTaggedInPostModel } from '../../posts/models/userTaggedInPost.model'
import { SequelizePostLikeModel } from '../../posts/models/postLike.model'
import { SequelizePostCommentModel } from '../../posts/models/postComment.model'

export function sequelizeUserAssociations () {
  SequelizeUserModel.belongsToMany(SequelizePostModel, {
    through: SequelizeUserTaggedInPostModel
  })

  SequelizeUserModel.hasMany(SequelizePostLikeModel)
  SequelizeUserModel.hasMany(SequelizePostCommentModel)
}
