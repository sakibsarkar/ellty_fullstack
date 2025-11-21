import Post from "../post/post.model";
import { TReactionType } from "./reaction.interface";
import Reaction from "./reaction.model";

const changeReactionByPostIdService = async (
  userId: string,
  postId: string,
  reactionId: TReactionType
) => {
  const isReactionExist = await Reaction.findOne({
    user: userId,
    post: postId,
  });

  if (isReactionExist) {
    if (isReactionExist.reactionId == reactionId) {
      const res = await Reaction.findByIdAndDelete(isReactionExist._id);
      await Post.findByIdAndUpdate(isReactionExist.post, {
        $inc: {
          reactionCount: -1,
        },
      });
      return res;
    } else {
      isReactionExist.reactionId = reactionId;
      await isReactionExist.save();
      return isReactionExist;
    }
  }

  const result = await Reaction.create({
    user: userId,
    post: postId,
    reactionId,
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: {
      reactionCount: 1,
    },
  });

  return result;
};

const reactionService = {
  changeReactionByPostIdService,
};

export default reactionService;
