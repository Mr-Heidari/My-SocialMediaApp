import { Link } from "react-router-dom";
import {
  useGetCurrentUser,
  useUserFollowRequest,
  useUserUnfollowRequest,
} from "@/lib/reat-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import Loader from "./Loader";

type UserCardProps = {
  name: string;
  userName: string;
  id: string;
  imageUrl: string;
};

const UserCard = ({ name, imageUrl, userName, id }: UserCardProps) => {

  //get user data
  const { user } = useUserContext();

  //action :  follow request 
  const { mutate: followRequest, isPending: followLoader } =
    useUserFollowRequest();
  

  //get some extra data for current user
  const { data: currentUser } = useGetCurrentUser();

  //action :  unfollow request
  const { mutate: unfollowRequest, isPending: unfollowLoader } =
    useUserUnfollowRequest();


  //check if current user follow ppls
  const isFollowed = currentUser?.following.find((followrequest) => {
    return followrequest.followers?.$id === id;
  });

  return (
    <>
      {/** desktop version */}
      <div className="w-40 h-40  gap-2 p-2 flex-center flex-col  max-lg:hidden">
        <Link to={`/profile/${id}`} className="flex-center flex-col">
          <img
            src={imageUrl || "/assets/icons/profile-placeholder.svg"}
            width={40}
            height={40}
            alt=""
            className="rounded-full"
          />
          <div>
            <p className="h-fit overflow-hidden w-24  text-ellipsis text-center mx-auto">
              {name}
            </p>
            <p className="h-fit overflow-hidden w-24 text-xs text-white/50 text-ellipsis text-center mx-auto">
              @{userName}
            </p>
          </div>
        </Link>
        {followLoader || unfollowLoader ? (
          <Loader width={32} height={32} />
        ) : (
          <div>
            <button
              className={
                " px-4 py-1  bg-white/70 rounded-md hover:bg-white text-black" +
                (isFollowed ? " hidden" : " ")
              }
              onClick={() => {
                followRequest({
                  requesterId: user.id,
                  receiverId: id,
                });
              }}
            >
              follow
            </button>
            <button
              className={
                " px-4 py-[6px] bg-neutral-950/60 rounded-md hover:bg-neutral-950/90" +
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

      {/** tablet, ipad, mobile, etc.. */}
        <div className=" lg:hidden w-full ">
      <div className="flex flex-row gap-5 justify-between p-4 bg-neutral-900 rounded-md h-20">
      <Link to={`/profile/${id}`} className="flex flex-row  justify-around">
          <img
            src={imageUrl || "/assets/icons/profile-placeholder.svg"}
            width={40}
            height={40}
            alt=""
            className="rounded-full h-14 w-14 my-auto object-cover"
          />
          <div className="my-auto">
            <p className="h-fit overflow-hidden w-24  text-ellipsis text-center mx-auto">
              {name}
            </p>
            <p className="h-fit overflow-hidden w-24 text-xs text-white/50 text-ellipsis text-center mx-auto">
              @{userName}
            </p>
          </div>
        </Link>
        {followLoader || unfollowLoader ? (
          <div className="my-auto"><Loader width={32} height={32} /></div>
        ) : (
          <div className="my-auto">
            <button
              className={
                " px-3 py-2 bg-white/70 rounded-md hover:bg-white text-black" +
                (isFollowed ? " hidden" : " ")
              }
              onClick={() => {
                followRequest({
                  requesterId: user.id,
                  receiverId: id,
                });
              }}
            >
              follow
            </button>
            <button
              className={
                " px-3 py-2 bg-neutral-950/60 rounded-md hover:bg-neutral-950/90" +
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
    </>
  );
};

export default UserCard;
