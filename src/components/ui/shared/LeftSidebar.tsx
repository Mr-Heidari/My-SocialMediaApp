import { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSignOutAccount } from "@/lib/reat-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import Loader from "./Loader";


//this just show on desltop version and its navigator bar
const LeftSidebar = () => {
  //get route pathname
  const { pathname } = useLocation();

  //sign out our user and delete user session from dratabase
  const { mutate: signOut, isSuccess,isPending:logoutLoader } = useSignOutAccount();

  const navigate = useNavigate();

  //we can access user information with useContext
  const { user } = useUserContext();

  //check if sign out success
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  return (
    <nav className="leftsidebar ">
      <div className="h-full w-full bg-neutral-900 px-6 py-[49px] ">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-33 items-center">
          <div className="flex flex-row gap-2">
            <img
              src="/assets/images/logo.svg"
              width={40}
              height={40}
              alt=""
              className="bg-white object-cover  rounded-2xl"
            />
            <p className="my-auto">my-socialmedia-app</p>
          </div>
        </Link>

        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
        
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-14 h-14 rounded-full object-cover "
          />
          <div className="flex flex-col">
            <p className="body-bold ">{user.name}</p>
            <p className="small-regular text-gray-500">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((Link: INavLink) => {
            const isActive = pathname === Link.route;
            return (
              <li
                key={Link.label}
                className={`leftsidebar-link group   ${
                  isActive && " bg-white/70 "
                }`}
              >
                <NavLink
                  to={Link.route}
                  className={"flex gap-4 items-center p-4"}
                >
                  <img
                    src={Link.imgURL}
                    alt={Link.label}
                    className={`group-hover:invert-white invert-white brightness-0  ${
                      isActive && "invert-white brightness-200"
                    }`}
                  />
                  <p className={` ${isActive && " text-black "}`}>
                    {Link.label}
                  </p>
                </NavLink>
              </li>
            );
          })}
        </ul>
        <button
          className=" hover:bg-white/70 rounded-md cursor-pointer transition-colors duration-200 "
          onClick={() => signOut()}
          disabled={logoutLoader}
        >
          <div className="flex flex-row gap-2 w-full brightness-200 hover:brightness-0 p-2  ">
            <img
              src="/assets/icons/logout.svg "
              alt="logout"
              className=""
            />
            <p className="small-medium lg:base-medium ">Log out</p>{logoutLoader ? (<Loader width={25} height={25}/>): <></>}
          </div>
        </button>
      </div>
      </div>
    </nav>
  );
};

export default LeftSidebar;
