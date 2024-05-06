import { Outlet, Navigate } from "react-router-dom";


//a beautifull layout for our sign in and sign up form 
const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to={"/"} />
      ) : (
        <>
          <section className=" flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img src="/assets/images/side-img.svg" alt="logo" className="hidden xl:block h-screen bg-neutral-900 object-cover bg-no-repeat" />
        </>
      )}
    </>
  );
};
export default AuthLayout;
