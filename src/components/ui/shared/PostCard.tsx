import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { multiFormatDateString } from "@/lib/utils";

type PostCardProps = {
    post: Models.Document;
  };


//this component use on home page 
const PostCard = ({post}: PostCardProps) => {
  //get current user information
    const { user } = useUserContext();

    if (!post.creator) return;
  
    return (
      <div className="post-card">
        <div className="flex-between m-5">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.creator.$id}`}>
              <img
                src={
                  post.creator?.imageUrl ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="creator"
                className="w-12 h-12 rounded-full"
              />
            </Link>
  
            <div className="flex flex-col ">
              <p className="text-sm lg:body-bold text-light-1">
                {post.creator.name}
              </p>
              <div className="flex-center gap-2 text-gray-500 ">
                <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
                </p>
                •
                <p className="subtle-semibold lg:small-regular">
                  {post.location}
                </p>
              </div>
            </div>
          </div>
  
          <Link
            to={`/update-post/${post.$id}`}
            className={`${user.id !== post.creator.$id && "hidden"}`}>
            <img
              src={"/assets/icons/edit.svg"}
              alt="edit"
              width={20}
              height={20}
              className=" invert brightness-0"
            />
          </Link>
        </div>
  
        <Link to={`/posts/${post.$id}`} className="relative overflow-hidden">
          <div className="text-sm lg:base-medium pb-5 px-5">
            <p className="line-clamp-1">{post.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post.tags.map((tag: string, index: string) => (
                <li key={`${tag}${index}`} className="text-white/70 text-xs bg-zinc-600 p-1 rounded-md">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden relative xs:h-[400px] lg:h-[450px]">
      
          <img
            src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="post image"
            className="post-card_img "
          />
          </div>
        </Link>
  
        <PostStats post={post} userId={user.id} />
      </div>
    );
}

export default PostCard