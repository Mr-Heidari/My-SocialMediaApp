import {  useGetSuggestedUsers } from "@/lib/reat-query/queriesAndMutation";
import UserCard from "./UserCard";
import { useUserContext } from "@/context/AuthContext";



const RightSideBar = () => {
  //get current user data
  const {user:currentUser}=useUserContext();

  //get suggested user from DB
  const { data: users } = useGetSuggestedUsers();
  const suggestedUsers=users?.documents.filter((user)=>{
    return user.$id!==currentUser.id
  })
  
  return (
    <>
    <div className="rightsidebar ">
      <p className="absolute top-4 text-white/70">Suggested for you</p>
      <div className="flex flex-row flex-wrap gap-2 h-fit justify-center  overflow-y-auto custom-scrollbar">
        {suggestedUsers?.map((user) => (
          <UserCard
            key={user.$createdAt}
            name={user.name}
            userName={user.username}
            id={user.$id}
            imageUrl={user.imageUrl}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default RightSideBar;
