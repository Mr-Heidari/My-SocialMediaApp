import { Models } from "appwrite";

import { useGetCurrentUser } from "@/lib/reat-query/queriesAndMutation";
import Loader from "@/components/ui/shared/Loader";
import GridPostList from "@/components/ui/shared/GridPostList";

//this comp is like tab in profile page
const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.imageUrl,
      },
    }))
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full ">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white brightness-0"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader width={30} height={30}/>
      ) : (
        <ul className="w-full flex flex-col justify-center md:flex-row md:flex-wrap gap-9">
          {savePosts.length === 0 ? (
            <p className="text-white/70">No available posts</p>
          ) : (
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;