import { z } from "zod";

// Define the valid reaction types
const ReactionTypeSchema = z.enum([
  "like",
  "love",
  "haha",
  "wow",
  "sad",
  "angry",
]);

// Define the validation schema for the object
const change = z.object({
  postId: z.string({ message: "post id is required as string" }),
  reactionId: ReactionTypeSchema,
});

const reactionValidation = {
  change,
};

export default reactionValidation;
