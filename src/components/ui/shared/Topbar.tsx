import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../button";
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
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="gap-4 flex">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className=" flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
