import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { MdLogin } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import ActionButtons from "../components/ActionButtons/ActionButtons";
import FamCrossLogo from "../assets/logo/logo-pink-filled.svg";
import ModalAuthUser from "../components/Modals/ModalAuthUser";

const PublicLayout = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const actions = [
    {
      label: "Iniciar Sesión",
      action: () => navigate("/login"),
      color: "purple",
      icon: MdLogin,
    },
    {
      label: "Registrarse",
      action: () => setOpenModal(true),
      color: "crossfit",
      icon: AiOutlineUserAdd,
      filled: true,
    },
  ];
  return (
    <div className="flex flex-col h-full w-full  overflow-y-auto overflow-x-hidden">
      <Navbar>
        <div className="hidden md:flex w-fit whitespace-nowrap text-nowrap justify-start gap-4 items-center p-2">
          <img
            src={FamCrossLogo}
            alt="Familia Crossfit ICON"
            className={
              "h-12 w-auto min-w-10 transition-all duration-300 ease-in-out"
            }
          />
          <span
            className={`text-xl text-crossfit-primary truncate text-center tracking-wider font-black`}
          >
            Familia
            <br /> Crossfit
          </span>
        </div>
        <div
          className="w-fit col-span-4 flex items-center justify-end gap-4 text-nowrap"
          style={{ marginLeft: "auto" }}
        >
          <ActionButtons extraActions={actions} />
        </div>
      </Navbar>
      <div className="flex-1 h-full mt-16">{children}</div>
      {openModal && (
        <ModalAuthUser
          openModal={openModal}
          setOpenModal={() => setOpenModal(!openModal)}
        />
      )}
    </div>
  );
};

export default PublicLayout;
