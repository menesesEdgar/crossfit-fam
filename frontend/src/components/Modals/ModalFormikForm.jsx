import React from "react";
import { Modal } from "flowbite-react";
import { FormikProvider, useFormik, Form } from "formik";
import ActionButtons from "../ActionButtons/ActionButtons";
import { FaSave } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const ModalForm = ({
  saveLabel,
  isOpenModal,
  title,
  onClose,
  size,
  position,
  dismissible,
  initialValues,
  onSubmit,
  formFields,
  schema,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: (values, actions) => {
      onSubmit(values, actions);
    },
  });

  return (
    <Modal
      position={position ?? "center"}
      size={size || "2xl"}
      show={isOpenModal}
      onClose={onClose}
      dismissible={dismissible}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>{formFields}</Form>
        </FormikProvider>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <ActionButtons
          extraActions={[
            {
              label: "Cancelar",
              action: onClose,
              color: "stone",
              icon: MdClose,
            },
            {
              label: saveLabel ? saveLabel : "Guardar",
              action: formik.submitForm,
              color: "crossfit",
              filled: true,
              icon: FaSave,
              type: "submit",
            },
          ]}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(ModalForm);
