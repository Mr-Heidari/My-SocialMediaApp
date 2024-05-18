import PostForm from "@/components/ui/forms/PostForm";
import Loader from "@/components/ui/shared/Loader";
import { useGetPostById } from "@/lib/reat-query/queriesAndMutation";
import { useParams } from "react-router-dom";

//edit post page
const EditPost = () => {

  //we set user id as dynamic rout and we can get id with useParams hook form react-router-dom
  const { id } = useParams();

  //get post id with useparams and we fetch post data with post id from DB 
  const { data: post, isPending } = useGetPostById(id || "");

  if (isPending)
    return (
      <div className="flex w-full top-1/2 translate-y-1/2">
        <div className="mx-auto">
        <Loader width={30} height={30}/>
        </div>
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start  w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full ">Edit Post</h2>
        </div>
        <PostForm action="Update" post={post} />
      </div>
    </div>
  );
};

export default EditPost;
