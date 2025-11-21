import { useState } from "react";
import {
  useGetCommentsByPostIdQuery,
  useLazyGetCommentRepliesByCommentIdQuery,
} from "redux/features/comment/comment.api";
import type { IComment } from "types/comment";
import { formatDate } from "utils/date.utils";
import CreateComment from "./CreateComment";
interface CommentItemProps {
  comment: IComment;
  level?: number;
  postId: string;
}
export function CommentItem({ comment, level = 0, postId }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);

  const [showReplyBox, setShowReplyBox] = useState(false);

  const [getReplies, { data, isLoading }] =
    useLazyGetCommentRepliesByCommentIdQuery();

  const handleLoadReplies = async () => {
    await getReplies(comment._id);
    setShowReplies(true);
  };

  return (
    <div
      className={`${level > 0 ? "ml-4 border-l-2 border-gray-200 pl-4" : ""}`}
    >
      <div>
        {" "}
        <div className="py-3 bg-muted px-3 rounded-[4px]">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-white">
              {comment.user.firstName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">
                {comment.user.firstName} {comment.user.lastName}
              </p>
              <p className="text-xs text-gray-500">@{comment.user.userName}</p>
            </div>
            <span className="text-xs text-gray-400">
              {formatDate(new Date(comment.createdAt))}
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-gray-800 text-sm leading-relaxed">
            {comment.comment}
          </p>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-3 mt-1">
          {comment.replyCount > 0 ? (
            <button
              onClick={handleLoadReplies}
              disabled={isLoading}
              className="text-xs text-blue-500 hover:text-blue-600 transition disabled:opacity-50 cursor-pointer hover:underline"
            >
              {isLoading
                ? "Loading..."
                : `${showReplies ? "Hide" : "Show"} ${comment.replyCount} ${comment.replyCount === 1 ? "Reply" : "Replies"}`}
            </button>
          ) : (
            ""
          )}
          <button
            onClick={() => {
              setShowReplyBox(!showReplyBox);
            }}
            className="text-xs text-blue-500 hover:text-blue-600 transition disabled:opacity-50 cursor-pointer hover:underline"
          >
            {showReplyBox ? "Cancel" : "Reply"}
          </button>
        </div>{" "}
        {showReplyBox && (
          <CreateComment
            postId={postId}
            parentComment={comment._id}
            onSuccess={() => handleLoadReplies()}
            placeholder={`Replying of ${comment.user?.firstName || ""}`}
          />
        )}
      </div>

      {/* Replies Section */}
      {showReplies && data?.data?.length && (
        <div className="space-y-2">
          {data?.data.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              level={level + 1}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
const PostCommentsByPostId = ({ postId }: { postId: string }) => {
  const { data, isLoading } = useGetCommentsByPostIdQuery({ postId, page: 1 });

  const comments = data?.data || [];
  return (
    <div className="w-full">
      <h5 className="text-lg font-bold">Comments</h5>
      <CreateComment postId={postId} />
      <div className="my-2">
        {isLoading ? (
          "Loading Comments..."
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No comments yet</p>
        ) : (
          <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={postId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCommentsByPostId;
