import { Modal } from "flowbite-react";
import classNames from "classnames";

const ModalViewer = ({
  isOpenModal,
  onCloseModal,
  children,
  size = "3xl",
  title = "",
  contentPosition = "center",
  dismissible = true,
  popup = false,
}) => {
  return (
    <Modal
      show={isOpenModal}
      size={size}
      onClose={onCloseModal}
      dismissible={dismissible}
      popup={popup}
    >
      <Modal.Header className="bg-crossfit-light-purple">
        <span className="text-white">{title}</span>
      </Modal.Header>
      <Modal.Body
        className={classNames("flex items-start", `justify-${contentPosition}`)}
      >
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default ModalViewer;
