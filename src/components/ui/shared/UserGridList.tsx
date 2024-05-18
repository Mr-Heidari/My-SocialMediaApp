import {
  useGetCurrentUser,
  useUserFollowRequest,
  useUserUnfollowRequest,
} from "@/lib/reat-query/queriesAndMutation";
import { IUser } from "@/types";
import { Models } from "appwrite";
import Loader from "./Loader";
import { Link } from "react-router-dom";

type UserGridListProp = {
  people: Models.Document;
  user: IUser;
};

const UserGridList = ({ people, user }: UserGridListProp) => {

  //action :  follow request 
  const { mutate: followRequest, isPending: followLoader } =
    useUserFollowRequest();

  const { data: currentUser } = useGetCurrentUser();

  //action :  unfollow request 
  const { mutate: unfollowRequest, isPending: unfollowLoader } =
    useUserUnfollowRequest();

    //check if current user follow ppls
  const isFollowed = currentUser?.following.find((followrequest) => {
    return followrequest.followers?.$id === people.$id;
  });

  return (
    <div className="">
      <div className=" border-b-2 w-full border-white/20 flex flex-row  h-20 px-5 mt-5">
        <div className=" flex flex-row justify-between  w-full">
          <Link className=" flex flex-row gap-2 my-auto" to={`/profile/${people.$id}`}>
            <img
              src={`${people.imageUrl}`}
              width={50}
              height={50}
              alt=""
              className="rounded-full object-cover w-14 h-14"
            />

            <div className="my-auto">
              <p>{people.name}</p>
              <p className="text-gray-500 text-xs">@{people.username}</p>
            </div>
          </Link>
          <div className="my-auto">
            {followLoader || unfollowLoader ? (
              <Loader width={32} height={32} />
            ) : (
              <div>
                <button
                  className={
                    " px-4 py-1 bg-white/70 rounded-md hover:bg-white text-black" +
                    (isFollowed ? " hidden" : " ")
                  }
                  onClick={() => {
                    followRequest({
                      requesterId: user.id,
                      receiverId: people.$id,
                    });
                  }}
                >
                  follow
                </button>
                <button
                  className={
                    " px-4 py-1 bg-neutral-950/60 rounded-md hover:bg-neutral-950/90" +
                    (isFollowed ? " " : " hidden")
                  }
                  onClick={() => {
                    unfollowRequest({
                      requestId: isFollowed?.$id,
                    });
                  }}
                >
                  unfollow
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGridList;
