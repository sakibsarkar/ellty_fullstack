import mongoose, { Types } from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },

    comment: {
      type: String,
      required: true,
    },
    post: {
      type: Types.ObjectId,
      required: true,
      ref: "Post",
    },
    replyCount: {
      type: Number,
      default: 0,
    },

    parentComment: {
      type: Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
