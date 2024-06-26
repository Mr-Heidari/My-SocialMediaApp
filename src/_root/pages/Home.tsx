import Loader from "@/components/ui/shared/Loader";
import PostCard from "@/components/ui/shared/PostCard";
import { useToast } from "@/components/ui/use-toast";
import { useGetRecentPosts} from "@/lib/reat-query/queriesAndMutation";
import { Models } from "appwrite";


const Home = () => {
  const { toast } = useToast();
  const {data:posts , isPending:isPostLoading }=useGetRecentPosts()
  function tokhmi(){
   return  toast({ title: "title: Sign in failed. Please try again." });
  }
  return (
    <div className="flex flex-1  ">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full"onClick={tokhmi}>Home Feed</h2>
          {isPostLoading && !posts ? (<Loader width={30} height={30}/>):(
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post :Models.Document)=>(
                <PostCard post={post} key={post.caption}/>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
