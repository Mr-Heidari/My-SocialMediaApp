import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignOutAccount } from "@/lib/reat-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";


//this comp just show on mobile device
const Topbar = () => {
  //sign out our user and delete user session from DB 
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  const navigate = useNavigate();
  
  //we can access user information with useContext
  const { user } = useUserContext();

  //check if sign out success
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className=" flex-between py-2 px-5 ">
        <Link to="/" className="flex gap-33 items-center">
        <div className="flex flex-row gap-2">
            <img
              src="/assets/images/logo.svg"
              width={36}
              height={36}
              alt=""
              className="bg-white object-cover  rounded-2xl"
            />
            <p className="my-auto text-sm">my-socialmedia-app</p>
          </div>
        </Link>

        <div className="gap-4 flex">
        <button
          className=" hover:bg-white/70 rounded-md cursor-pointer transition-colors duration-200 "
          onClick={() => signOut()}
        >
          <div className="flex flex-row gap-2 w-full brightness-200 hover:brightness-0 p-2  ">
            <img
              src="/assets/icons/logout.svg "
              alt="logout"
              className=""
            />
          </div>
        </button>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover "
          />
        </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
