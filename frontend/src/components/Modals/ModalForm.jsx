import React from 'react';
import { Modal } from 'flowbite-react';
import ActionButtons from '../ActionButtons/ActionButtons';

const ModalForm = ({
  children,
  isOpenModal,
  title,
  onClose,
  size,
  position,
  dismissible,
  actions = [],
}) => {
  return (
    <Modal
      position={position ?? 'center'}
      size={size || '2xl'}
      show={isOpenModal}
      onClose={onClose}
      dismissible={dismissible}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {actions && <ActionButtons actions={actions} />}
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(ModalForm);
