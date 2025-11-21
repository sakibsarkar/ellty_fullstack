import { useGetAllPostQuery } from "redux/features/post/post.api";

const AllPost = () => {
  const { data } = useGetAllPostQuery({});
  console.log(data);

  return <div></div>;
};

export default AllPost;
