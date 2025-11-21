import { useState } from "react";
import { useCratePostMutation } from "redux/features/post/post.api";
import { useAppSelector } from "redux/hook";
import { toast } from "sonner";
import type { IQueryMutationErrorResponse } from "types/query";

const CreatePost = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [content, setContent] = useState("");

  const [createPost, { isLoading }] = useCratePostMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    const res = await createPost({ content });
    const error = res.error as IQueryMutationErrorResponse;
    if (error?.data?.message) {
      toast.error(error.data.message);
      return;
    }

    toast.success("Post created successfully");
    setContent("");
  };
  return (
    <>
      {!user ? null : (
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-lg p-4 mb-6"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-24 p-3 bg-background border border-border rounded-lg text-card-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setContent("")}
              className="px-4 py-2 text-card-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || isLoading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default CreatePost;
