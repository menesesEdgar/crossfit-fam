import React from "react";
import { Button } from "flowbite-react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import FamCrossLogo from "../../assets/logo/logo-pink-filled.svg";
import { useAuthContext } from "../../context/AuthContext";

const Navbar = ({
  collapsed,
  setCollapsed = () => {},
  toggled,
  setToggled = () => {},
  broken,
  children,
}) => {
  const { user } = useAuthContext()
  return (
    <div className="flex justify-between gap-4 items-center bg-white shadow-md p-2 w-full h-16 absolute top-0 left-0 z-50">
      {
        user && (
          <Button
            onClick={broken ? setToggled : setCollapsed}
            color="light"
            style={{ borderStyle: "none" }}
            className="h-8 w-8 flex items-center justify-center rounded-md transition-colors duration-100 ease-in-out text-pink-500 hover:text-pink-600"
          >
            <HiOutlineMenuAlt1 className="text-2xl cursor-pointer" />
          </Button>
        )
      }

      <img
        src={FamCrossLogo}
        alt="Familia Crossfit Logo"
        className="h-7 block md:hidden"
      />
      {children}
    </div>
  );
};

export default Navbar;
