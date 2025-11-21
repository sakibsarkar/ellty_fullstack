import React, { useState } from "react";
import { useCreateCommentMutation } from "redux/features/comment/comment.api";
import { useAppSelector } from "redux/hook";
import { toast } from "sonner";
import type { IQueryMutationErrorResponse } from "types/query";

const CreateComment = ({
  postId,
  parentComment,
  placeholder = "Write a comment...",
  onSuccess,
}: {
  postId: string;
  parentComment?: string;
  placeholder?: string;
  onSuccess?: () => void;
}) => {
  const [comment, setComment] = useState("");

  const [createComment, { isLoading }] = useCreateCommentMutation();

  const { user } = useAppSelector((state) => state.auth);

  const handleSubmit = async () => {
    if (!comment.trim() || isLoading) return;

    if (!user) {
      toast.error("You must be logged in to comment");
      return;
    }

    const res = await createComment({
      postId,
      comment,
      parentComment,
    });

    const error = res.error as IQueryMutationErrorResponse;
    if (error?.data?.message) {
      toast.error(error.data.message);
      return;
    }

    setComment("");
    onSuccess?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };
  return (
    <div className="w-full rounded-lg  bg-white mb-2">
      <div className="flex items-end justify-between mt-3 gap-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[100px]"
        />{" "}
        <button
          onClick={handleSubmit}
          disabled={!comment.trim() || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm font-medium"
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </div>{" "}
      <span className="text-xs text-gray-500">
        {comment.length > 0 && `${comment.length} characters`}
      </span>
    </div>
  );
};

export default CreateComment;
