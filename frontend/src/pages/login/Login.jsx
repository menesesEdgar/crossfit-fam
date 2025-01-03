import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import AuthContext from "../../context/AuthContext";
import FamCrossfitLogo from "../../assets/logo/logo-pink-filled.svg";
import FamCrossfitLogoWhite from "../../assets/logo/logo-white-transparent.png";

import BgLogin3 from "../../assets/bg/bg-login-3.webp";
import { FaSignInAlt, FaTrophy } from "react-icons/fa";
import TextInput from "../../components/Inputs/TextInput";
import { MdOutlineAlternateEmail, MdOutlinePassword } from "react-icons/md";
import { Button } from "flowbite-react";
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import ModalAuthUser from "../../components/Modals/ModalAuthUser";
import { CiCreditCard1 } from "react-icons/ci";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const formRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Formato de correo electrónico invalido")
        .required("Ingrese un correo electrónico válido"),
      password: Yup.string().required("La contraseña es invalida"),
    }),
    onSubmit: async (values) => {
      await login(values);
      navigate("/contest");
    },
  });

  return (
    <FormikProvider value={formik}>
      <div className="flex h-full text-white md:text-gray-800 relative">
        <div
          className="h-dvh shadow-xl max-h-dvh overflow-hidden w-full flex items-center justify-center bg-gray-100 bg"
          style={{
            backgroundImage: `url(${BgLogin3})`,
            backgroundSize: "cover",
          }}
        >
          <div className="hidden h-dvh md:flex justify-start items-end bg-gradient-to-b from-transparent w-full to-black">
            <div className="p-2 flex flex-col items-center gap-2">
              <img
                src={FamCrossfitLogoWhite}
                alt="Familia Crossfit Logo"
                className="h-auto w-16"
              />
              <h1 className="text-lg text-center text-white font-bold tracking-wider">
                Familia <br /> Crossfit
              </h1>
            </div>
          </div>
        </div>
        <div className="absolute md:relative flex flex-col justify-start bg-black/35 md:bg-white p-8 pt-14 rounded shadow-lg w-full mx-auto md:max-w-md h-dvh">
          <div className="flex flex-col items-center justify-center">
            <img
              src={FamCrossfitLogoWhite}
              alt="Familia Crossfit Logo"
              className="h-auto w-20 md:hidden"
            />
            <img
              src={FamCrossfitLogo}
              alt="Familia Crossfit Logo"
              className="h-auto w-20 hidden md:block"
            />
            <h1 className="text-3xl text-center mb-4 font-black tracking-wider md:text-pink-600">
              Familia <br /> Crossfit
            </h1>
          </div>
          <h2 className="text-xl mb-2">Iniciar Sesión</h2>
          <Form
            ref={formRef}
            className="space-y-4"
            onSubmit={formik.handleSubmit}
            autoComplete="off"
          >
            <Field
              component={TextInput}
              id="email"
              name="email"
              type="email"
              label="Correo Electrónico"
              icon={MdOutlineAlternateEmail}
            />
            <Field
              component={TextInput}
              id="password"
              name="password"
              type="password"
              label="Contraseña"
              icon={MdOutlinePassword}
            />
            <div className="flex justify-center w-full items-center gap-4 pt-4">
              <Button
                className="w-full"
                type="submit"
                gradientDuoTone="purpleToPink"
              >
                <FaSignInAlt size={20} className="mr-2" />
                Iniciar Sesión
              </Button>
            </div>
          </Form>
          {/* <div className="flex flex-col items-center justify-center mt-8">
            <p className="text-sm text-white md:text-gray-500">
              ¿Problemas para iniciar sesión?
            </p>
            <ActionButtons
              extraActions={[
                {
                  label: "Recuperar contraseña",
                  href: "/forgot-password",
                  outline: true,
                  className:
                    "border-none text-white underline md:text-neutral-800 hover:text-purple-500",
                },
              ]}
            />
          </div> */}
          <section className="text-white md:text-neutral-800">
            <div className="flex justify-center items-center  w-full h-16">
              <p className="text-sm">
                ¿No tienes una cuenta?{" "}
                <span
                  className="text-purple-500 hover:underline cursor-pointer"
                  onClick={() => setOpenModal(true)}
                >
                  Regístrate
                </span>
              </p>
            </div>
            <p
              style={{
                width: "100%",
                textAlign: "center",
                borderBottom: "1px solid #e2e8f0",
                lineHeight: "0.1em",
                margin: "10px 0 20px",
              }}
              className="col-span-12 text-base font-semibold"
            >
              <span style={{ padding: "0 20px" }}></span>
            </p>
            <div className="flex flex-row gap-2 md:bg-neutral-100 rounded-lg py-2 px-5 justify-left items-center w-full mt-2">
              <span>
                <CiCreditCard1 size={40} className="text-gray-500" />
              </span>
              <p className="text-sm">
                Nombre: <span className="font-bold">Julia Jazmin Covarrubias Aceves</span> <br />
                Banamex: <span className="font-bold"> 5204-1674-5048-9794</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 md:bg-neutral-100 rounded-lg py-6 justify-center items-center w-full mt-4">
              <span>
                <FaTrophy size={50} className="text-yellow-300" />
              </span>
              <p className="text-sm">
                Hechale un vistazo a nuestras competencias activas
              </p>
              <ActionButtons
                extraActions={[
                  {
                    label: "Ver competencias",
                    href: "/public/contest",
                    color: "yellow",
                    filled: true,
                  },
                ]}
              />
            </div>
          </section>
        </div>
      </div>
      {openModal && (
        <ModalAuthUser
          openModal={openModal}
          setOpenModal={() => setOpenModal(!openModal)}
        />
      )}
    </FormikProvider>
  );
};

export default Login;
