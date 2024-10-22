import { Button, Modal } from 'flowbite-react';
import { HiExclamationCircle } from 'react-icons/hi';
import { RiDeleteBin2Fill } from 'react-icons/ri';

const ModalRemove = ({ removeFunction, isOpenModal, onCloseModal }) => {
  return (
    <Modal show={isOpenModal} size="2xl" onClose={onCloseModal} dismissible>
      <Modal.Header>
        <div className="flex items-center gap-2">
          <span>
            <HiExclamationCircle
              size={24}
              className="text-red-500 dark:text-gray-200"
            />
          </span>
          <h3 className="text-red-500 font-bold dark:text-gray-200">
            Eliminar
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <RiDeleteBin2Fill className="mx-auto mb-4 h-24 w-24 text-red-500 dark:text-gray-200" />
          <h3 className="text-xl font-normal text-gray-500 dark:text-gray-400">
            ¿Estás seguro de que deseas eliminar este registro?
          </h3>
          <p className="text-base text-gray-400 dark:text-gray-300 mb-5">
            Recuerda que esta acción es{' '}
            <strong className="text-red-600">definitiva</strong> y{' '}
            <strong className="text-red-600">NO</strong> se puede deshacer.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-center gap-4 w-full">
          <Button color="gray" onClick={onCloseModal}>
            No, cancelar
          </Button>
          <Button color="failure" onClick={removeFunction}>
            Sí, eliminar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRemove;
