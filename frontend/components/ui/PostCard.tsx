import type { IPost } from "types/post";

export function PostCard({ post }: { post: IPost }) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header with user info */}
      <div className="flex items-start gap-3 mb-3">
        {post.user.image ? (
          <img
            src={post.user.image || "/placeholder.svg"}
            alt={post.user.userName}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-muted-foreground">
              {post.user.firstName.charAt(0)}
              {post.user.lastName.charAt(0)}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-card-foreground text-sm">
            {post.user.firstName} {post.user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">@{post.user.userName}</p>
        </div>

        <time className="text-xs text-muted-foreground whitespace-nowrap">
          {formattedDate}
        </time>
      </div>

      {/* Post content */}
      <div className="mb-4">
        <p className="text-card-foreground text-sm leading-relaxed break-words">
          {post.content}
        </p>
      </div>

      {/* Footer with engagement metrics */}
      <div className="flex items-center gap-4 pt-3 border-t border-border text-xs text-muted-foreground">
        <button className="hover:text-card-foreground transition-colors">
          💬 {post.commentCount}{" "}
          {post.commentCount === 1 ? "Comment" : "Comments"}
        </button>
        <button className="hover:text-card-foreground transition-colors">
          ❤️ Like
        </button>
        <button className="hover:text-card-foreground transition-colors">
          ↗️ Share
        </button>
      </div>
    </div>
  );
}
