import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/reat-query/queriesAndMutation";
import Loader from "./Loader";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  //get route data
  const location = useLocation();

  //ceate list of user id evey body liked  post foreach post
  const likesList = post?.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likesList);

  const [isSaved, setIsSaved] = useState(false);

  //a action for send client data to DB and return changed data
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost ,isPending:isSavingPost} = useSavePost();
  const { mutate: deleteSavePost,isPending:isDeletingSaved } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  //current user get saved post 
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post?.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);


 
  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

     //check current user isliked on post
    if (likesArray.includes(userId)) {
      likesArray = likesArray.filter((Id) => Id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    //send new list of likes for each post to DB
    likePost({ postId: post?.$id || '',  likesArray });
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavePost(savedPostRecord.$id);
    }

    //saved post id  to user collection  inside saved attribute on DB
    savePost({ userId: userId, postId: post.$id });
    setIsSaved(true);
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between xs:mt-5 my-auto max-md:mx-5 z-20 ${containerStyles}`}>
      <div className="flex gap-2 md:m-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer invert brightness-0"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2 ">
      {isSavingPost || isDeletingSaved ? <Loader width={22} height={22}/> :<img
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer invert brightness-0 md:m-5"
          onClick={(e) => handleSavePost(e)}
        />}
      </div>
    </div>
  );
};

export default PostStats;