import { Modal } from 'flowbite-react';
import classNames from 'classnames';

const ModalViewer = ({
  isOpenModal,
  onCloseModal,
  children,
  size = '3xl',
  title = '',
  contentPosition = 'center',
  dismissible = true,
}) => {
  return (
    <Modal
      show={isOpenModal}
      size={size}
      onClose={onCloseModal}
      dismissible={dismissible}
      popup
    >
      <Modal.Header className="border-b border-neutral-200 truncate">
        {title}
      </Modal.Header>
      <Modal.Body
        className={classNames('flex items-start', `justify-${contentPosition}`)}
      >
        {children}
      </Modal.Body>
    </Modal>
  );
};

export default ModalViewer;
