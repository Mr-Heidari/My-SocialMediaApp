import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate=useNavigate()
  return (
    <div className="w-full h-screen flex ">
      <div className="absolute w-full h-full">
        <img src="/assets/images/404.png" alt=""  className="object-contain w-full h-full"/>
        <button className="absolute p-2 border-[1px] rounded-md px-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-20" onClick={()=>navigate(-1)}>Back</button>
        <p className="absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-40 text-4xl font-extrabold">Not found</p>
      </div>
    </div>
  );
};

export default ErrorPage;
