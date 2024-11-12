import React, { useState } from "react";
import * as Yup from "yup";
import ModalFormikForm from "./ModalFormikForm";
import { usePublicContext } from "../../context/PublicContext";
import ModalViewer from "./ModalViewer";
import AthleteFormFields from "../AthleteComponents/AthleteFormFields";
import { AthleteFormSchema } from "../AthleteComponents/AthleteFormSchema";
import {
  FaCalendarAlt,
  FaMedal,
  FaPhoneSquareAlt,
  FaUser,
  FaUserTag,
  FaVenusMars,
} from "react-icons/fa";
import ActionButtons from "../ActionButtons/ActionButtons";
import { MdEmail, MdLogin, MdOutlinePassword } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Field } from "formik";
import LoadingModal from "../LoadingModal/LoadingModal";
import TextInput from "../Inputs/TextInput";
import SelectInput from "../Inputs/SelectInput";
import DateInput from "../Inputs/DateInput";
import classNames from "classnames";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const initRegisterValues = {
  firstName: "",
  lastName: "",
  birthDate: "",
  gender: "",
  email: "",
  phone: "",
  status: false,
};

const initLoginValues = {
  email: "",
  password: "",
};

const genderOptions = [
  {
    id: "1",
    name: "Masculino",
  },
  {
    id: "2",
    name: "Femenino",
  },
  {
    id: "3",
    name: "Otro",
  },
];

const ModalRegisterUser = ({ openModal = false, setOpenModal }) => {
  const navigate = useNavigate();
  const { useCreatePendingUser } = usePublicContext();
  const { login } = useAuthContext();
  const [isModalViewerOpen, setIsModalViewerOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [initialValues, setInitialValues] = useState(
    isLogin ? initLoginValues : initRegisterValues
  );
  const [activeTab, setActiveTab] = useState(0);

  React.useEffect(() => {
    setInitialValues(isLogin ? initLoginValues : initRegisterValues);
  }, [isLogin]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      isLogin ? await login(values) : await useCreatePendingUser(values);
      setSubmitting(false);
      resetForm();
      setOpenModal(false);
      isLogin ? navigate("/contest") : setIsModalViewerOpen(true);
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  const onCloseModal = () => {
    setOpenModal(false);
    setIsModalViewerOpen(false);
    setInitialValues(isLogin ? initLoginValues : initRegisterValues);
  };
  const ContentTab = ({ value }) => {
    return (
      <div
        className={classNames(
          "grid gap-4",
          isLogin ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
        )}
      >
        {!value && (
          <>
            <Field
              name="firstName"
              component={TextInput}
              label="* Nombre"
              type="text"
              icon={FaUser}
            />
            <Field
              name="lastName"
              component={TextInput}
              label="* Apellidos"
              type="text"
              icon={FaUserTag}
            />
            <Field
              name="birthDate"
              component={DateInput}
              label="* Fecha de nacimiento"
              type="date"
              icon={FaCalendarAlt}
            />
            <Field
              name="gender"
              component={SelectInput}
              label="* Género"
              type="number"
              options={genderOptions.map((gender) => ({
                label: gender.name,
                value: gender.name,
              }))}
              icon={FaVenusMars}
            />
          </>
        )}
        <Field
          name="email"
          component={TextInput}
          label="* Correo electrónico"
          type="text"
          icon={MdEmail}
          placeholder="example@mail.com"
        />
        {value && (
          <Field
            name="password"
            component={TextInput}
            label="Contraseña"
            type="password"
            icon={MdOutlinePassword}
          />
        )}
        {!value && (
          <Field
            name="phone"
            id="phone"
            component={TextInput}
            label="Teléfono"
            type="tel"
            icon={FaPhoneSquareAlt}
            placeholder="123-456-7890"
          />
        )}
      </div>
    );
  };

  const tabContent = [
    {
      id: 0,
      title: "Inicio de sesión",
      icon: <MdLogin size={24} />,
      component: <ContentTab value={isLogin} />,
    },
    {
      id: 1,
      title: "Registrarse",
      icon: <AiOutlineUserAdd size={24} />,
      component: <ContentTab value={isLogin} />,
    },
  ];

  const AuthLayoutContent = () => {
    return (
      <div className="w-full min-h-80 h-full flex flex-col">
        <div className="grid grid-cols-2 bg-white border-b-2 rounded-lg border-neutral-200 overflow-x-auto">
          {tabContent.map((tab, index) => (
            <button
              key={tab.id}
              className={`flex items-center justify-center rounded-md text-sm md:text-lg gap-2 px-4 py-2 transition duration-200 ${
                activeTab === index
                  ? "text-white font-semibold bg-crossfit-primary m-1"
                  : "text-neutral-800 hover:text-crossfit-light-pink"
              }`}
              onClick={() => {
                setIsLogin(!isLogin);
                setActiveTab(index);
              }}
            >
              <i>{tab.icon}</i>
              {tab.title}
            </button>
          ))}
        </div>
        <div className="relative bg-white rounded-md h-full max-h-[80dvh] md:max-h-[82dvh] overflow-hidden mt-4">
          <div className="h-full overflow-auto">
            {tabContent.map((tab, index) => (
              <div
                key={tab.id}
                className={`tab-content flex-1 h-full ${
                  activeTab === index ? "active" : "inactive"
                }`}
              >
                <React.Suspense fallback={<LoadingModal loading={true} />}>
                  {tab.component}
                </React.Suspense>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ModalFormikForm
        onClose={onCloseModal}
        isOpenModal={openModal}
        dismissible
        title={"Identificate"}
        schema={
          isLogin
            ? Yup.object({
                email: Yup.string()
                  .email("Formato de correo electrónico invalido")
                  .required("Ingrese un correo electrónico válido"),
                password: Yup.string().required("La contraseña es invalida"),
              })
            : AthleteFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleSubmit}
        formFields={<AuthLayoutContent />}
        saveLabel={isLogin ? "Iniciar sesión" : "Registrarse"}
      />
      {isModalViewerOpen && (
        <ModalViewer
          isOpenModal={isModalViewerOpen}
          onCloseModal={() => onCloseModal()}
          title={"¡Registro exitoso!"}
          size="2xl"
        >
          <div className="flex flex-col justify-center gap-4">
            <span className="flex justify-center">
              <FaMedal size={100} className="text-crossfit-warning" />
            </span>
            <div>
              <h2 className="text-lg text-center md:text-2xl font-semibold text-crossfit-primary">
                ¡Tu cuenta ha sido creada exitosamente!
              </h2>
              <p className="text-base pt-4 md:text-lg text-neutral-800">
                ¡Bienvenido a Familia Crossfit!
              </p>
              <p className="text-sm md:text-base pt-2 text-neutral-600/80">
                El administrador revisará tu solicitud y se pondrá en contacto
                para confirmar tu registro. Toma un descanso y preparate para
                dar lo mejor de ti en las próximas competencias. ¡Gracias por
                unirte a nuestra familia!
              </p>
            </div>
            <ActionButtons
              extraActions={[
                {
                  label: "Aceptar",
                  action: () => onCloseModal(),
                  color: "crossfit",
                  filled: true,
                  className: "min-w-full",
                },
              ]}
            />
          </div>
        </ModalViewer>
      )}
    </>
  );
};

export default ModalRegisterUser;
