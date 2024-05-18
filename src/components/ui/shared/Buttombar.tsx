import { bottombarLinks } from "@/constants";
import { INavLink } from "@/types";
import { useLocation, Link } from "react-router-dom";

//show on mobile devices
const Buttombar = () => {
  //get route pathname
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname === link.route;
        return (
          <li key={link.label}>
            <Link
              to={link.route}
              className={` flex-center flex-col gap-1 p-2 transition rounded-md ${
                isActive && "bg-white/70  "
              }`}
            >
              <img
                src={link.imgURL}
                alt={link.label}
                className={` brightness-200 ${
                  isActive && "invert-white brightness-0"
                }`}
                width={18}
                height={18}
              />
              <p className={`tiny-medium ${isActive && " text-black"}`}>
                {" "}
                {link.label}
              </p>
            </Link>
          </li>
        );
      })}
    </section>
  );
};

export default Buttombar;
