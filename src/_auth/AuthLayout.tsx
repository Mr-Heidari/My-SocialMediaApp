import { useUserContext } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

//a beautifull layout for our sign in and sign up form
const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();
  return (
    <>
      {isAuthenticated ? (
        <Navigate to={"/"} />
      ) : (
        <>
          <section className=" flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src="/assets/images/side-img.jpg"
            alt="logo"
            className="w-full absolute h-screen object-cover blur-sm bg-black/70"
          />
          <div className="w-full absolute h-screen bg-black/40 bg-gradient-to-t   from-black/50">
            {" "}
          </div>
        </>
      )}
    </>
  );
};
export default AuthLayout;
