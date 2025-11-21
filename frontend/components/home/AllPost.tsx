import { PostCard } from "components/home/PostCard";
import { useGetAllPostQuery } from "redux/features/post/post.api";

const AllPost = () => {
  const { data } = useGetAllPostQuery({});

  return (
    <div className="flex flex-col gap-4">
      {data?.data.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default AllPost;
