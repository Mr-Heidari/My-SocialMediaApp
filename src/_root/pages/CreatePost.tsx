import PostForm from "@/components/ui/forms/PostForm";

//create post Page
const CreatePost = () => {
  return (
    <div className="flex flex-1 max-md:pt-14 max-md:pb-20 overflow-auto max-h-screen  h-full ">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start  w-full">
          <img
            src="/assets/icons/add-post.svg" 
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full ">Create Post</h2>

          
        </div>
        <PostForm action='Create' post={undefined}/>
      </div>
    </div>
  );
};

export default CreatePost;
