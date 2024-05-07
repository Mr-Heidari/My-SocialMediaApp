import { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../button";
import { useSignOutAccount } from "@/lib/reat-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSidebar = () => {
  const { pathname } = useLocation();

  //sign out our user and delete user session from dratabase
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  const navigate = useNavigate();

  //we can access user information with useContext
  const { user } = useUserContext();

  //check if sign out success
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  return (
    <nav className="leftsidebar ">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-33 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-14 h-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold ">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((Link: INavLink) => {
            const isActive = pathname === Link.route;
            return (
              <li key={Link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500' }`}>
                <NavLink
                  to={Link.route}
                  className={"flex gap-4 items-center p-4"}
                >
                  <img
                    src={Link.imgURL}
                    alt={Link.label}
                    className={`group-hover:invert-white ${isActive && 'invert-white' }`}
                  />
                  {Link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
            <p className="small-medium lg:base-medium">Log out</p>
          </Button>
      </div>
    </nav>
  );
};

export default LeftSidebar;
