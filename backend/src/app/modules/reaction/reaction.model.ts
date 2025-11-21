import mongoose, { Types } from "mongoose";

const ReactionSchema = new mongoose.Schema(
  {
    reactionId: {
      type: String,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
      required: true,
    },
    post: {
      type: Types.ObjectId,
      ref: "Post",
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Reaction = mongoose.model("Reaction", ReactionSchema);

export default Reaction;
