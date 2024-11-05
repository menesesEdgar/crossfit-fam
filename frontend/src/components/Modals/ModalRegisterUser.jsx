import React, { useState } from "react";
import ModalFormikForm from "./ModalFormikForm";
import { usePublicContext } from "../../context/PublicContext";
import ModalViewer from "./ModalViewer";
import AthleteFormFields from "../AthleteComponents/AthleteFormFields";
import { AthleteFormSchema } from "../AthleteComponents/AthleteFormSchema";
import { FaMedal } from "react-icons/fa";
import ActionButtons from "../ActionButtons/ActionButtons";

const initValues = {
  firstName: "",
  lastName: "",
  birthDate: "",
  gender: "",
  email: "",
  phone: "",
  status: false,
};

const ModalRegisterUser = ({ openModal = false, setOpenModal }) => {
  const { useCreatePendingUser } = usePublicContext();
  const [isModalViewerOpen, setIsModalViewerOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    ...initValues,
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await useCreatePendingUser(values);
      setSubmitting(false);
      resetForm();
      setIsModalViewerOpen(true);
      setInitialValues({
        ...initValues,
      });
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  const onCloseModal = () => {
    setOpenModal(false);
    setIsModalViewerOpen(false);
    setInitialValues({
      ...initValues,
    });
  };
  return (
    <>
      <ModalFormikForm
        onClose={onCloseModal}
        isOpenModal={openModal}
        dismissible
        title={"Crea tu cuenta"}
        schema={AthleteFormSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        formFields={<AthleteFormFields />}
        saveLabel={"Registrarme"}
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
