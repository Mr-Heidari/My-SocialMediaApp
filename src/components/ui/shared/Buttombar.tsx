import { bottombarLinks } from "@/constants";
import { INavLink } from "@/types";
import { useLocation, Link } from "react-router-dom";
const Buttombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname === link.route;
        return (
          <li key={link.label}>
            <Link
              to={link.route}
              
              className={` flex-center flex-col gap-1 p-2 transition ${
                isActive && "bg-primary-500 rounded-md "
              }`}
            >
              <img
                src={link.imgURL}
                alt={link.label}
                className={`${
                  isActive && "invert-white"
                }`}
                width={18}
                height={18}
              />
              <p className="tiny-medium text-light-2"> {link.label}</p>
             
            </Link>

          </li>
        );
      })}
    </section>
  );
};

export default Buttombar;
