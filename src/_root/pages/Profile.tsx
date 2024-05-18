import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetCurrentUser,
  useGetUserById,
  useUserFollowRequest,
  useUserUnfollowRequest,
} from "@/lib/reat-query/queriesAndMutation";
import Loader from "@/components/ui/shared/Loader";
import GridPostList from "@/components/ui/shared/GridPostList";

interface StabBlockProps {
  value: string | number;
  label: string;
}

//this comp work like following and follower in instagram
const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2 border-2 p-1 px-3 rounded-md bg-white/20">
    <p className="small-semibold lg:body-bold text-slate-400">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

//profile page
const Profile = () => {
  //get user id from route
  const { id } = useParams();

  //get user information from context hook
  const { user } = useUserContext();

  //get route path
  const { pathname } = useLocation();

  const { mutate: followRequest, isPending: followLoader } =
    useUserFollowRequest();

  //get user information from DB
  const { data: currentUser } = useGetUserById(id || "");

  const { data: currentUsera } = useGetCurrentUser();

  const { mutate: unfollowRequest, isPending: unfollowLoader } =
    useUserUnfollowRequest();

  const isFollowed = currentUsera?.following.find((followrequest) => {
    return followrequest.followers?.$id === id;
  });

  //current user data isPending
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full max-md:pt-20">
        <Loader width={40} height={40} />
      </div>
    );

  const handleFollowRequest = () => {
    followRequest({
      requesterId: user.id,
      receiverId: currentUser.$id,
    });
  };

  const handleUnfollowRequest = () => {
    unfollowRequest({
      requestId: isFollowed?.$id,
    });
  };

  return (
    <div className="profile-container">
      <div
        className="profile-inner_container"
      >
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 object-cover rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-gray-500 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock
                value={currentUser.followers.length}
                label="Followers"
              />
              <StatBlock
                value={currentUser.following.length}
                label="Following"
              />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                  className="invert brightness-0"
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              {followLoader || unfollowLoader ? (
                <Loader width={32} height={32} />
              ) : (
                <div>
                  <button
                    className={
                      " px-4 py-1 bg-white/40 rounded-md hover:bg-white/60" +
                      (isFollowed ? " hidden" : " ")
                    }
                    onClick={handleFollowRequest}
                  >
                    follow
                  </button>
                  <button
                    className={
                      " px-4 py-1 bg-white/40 rounded-md hover:bg-white/60" +
                      (isFollowed ? " " : " hidden")
                    }
                    onClick={handleUnfollowRequest}
                  >
                    unfollow
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-white/50"></div>
      {currentUser.$id === user.id && (
        <div className="flex  w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "invert"
            }`}
          >
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
              className="invert brightness-0 "
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "invert"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
              className="invert brightness-0"
            />
            Liked Posts
          </Link>
        </div>
      )}
      
      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser.posts} showUser={false} />}
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
