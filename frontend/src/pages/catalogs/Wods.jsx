import { useState, useEffect } from "react";
import { useCatalogContext } from "../../context/CatalogContext";

import CatalogCardList from "../../components/CatalogCardList/CatalogCardList";
import useCheckPermissions from "../../hooks/useCheckPermissions";
import withPermission from "../../utils/withPermissions";
import WodFormFields from "../../components/Catalogs/Wods/WodFormFields";
import { WodFormSchema } from "../../components/Catalogs/Wods/WodFormSchema";
import ModalFormikForm from "../../components/Modals/ModalFormikForm";
import ModalRemove from "../../components/Modals/ModalRemove";
import { BiSolidZap } from "react-icons/bi";

const Wods = () => {
  const isCreatepermission = useCheckPermissions("create_wod");
  const isEditPermission = useCheckPermissions("edit_wod");
  const isDeletepermission = useCheckPermissions("delete_wod");

  const {
    createWod,
    updateWod,
    deleteWod,
    wods: allWods,
    loading,
  } = useCatalogContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [removeWodId, setRemoveWodId] = useState(null);
  const [wods, setWods] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    id: "",
  });

  useEffect(() => {
    setWods(allWods);
  }, [allWods]);

  const handleEdit = (wod) => {
    setEditMode(true);
    setInitialValues({
      name: wod.name,
      description: wod.description,
      id: wod.id,
    });
    setIsOpenModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      editMode ? await updateWod(values) : await createWod(values);
      resetForm();
      setInitialValues({
        name: "",
        description: "",
        id: "",
      });
      setIsOpenModal(false);
      setEditMode(false);
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  const onCloseModal = () => {
    setIsOpenModal(false);
    setEditMode(false);
    setInitialValues({
      name: "",
      description: "",
      id: "",
    });
  };

  const handleDelete = async () => {
    try {
      await deleteWod(removeWodId);
      setIsOpenDeleteModal(false);
      setRemoveWodId(null);
    } catch (error) {
      console.error(error);
      setIsOpenDeleteModal(false);
    }
  };

  const onCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
    setRemoveWodId(null);
  };

  const onOpenDeleteModal = (wod) => {
    setIsOpenDeleteModal(true);
    setRemoveWodId(wod);
  };
  return (
    <div className="flex h-full flex-col flex-1 overflow-hidden">
      {wods && !loading ? (
        <CatalogCardList
          icon={BiSolidZap}
          data={wods}
          title="WODs"
          onCreate={
            isCreatepermission.hasPermission ? () => setIsOpenModal(true) : null
          }
          onEdit={
            isEditPermission.hasPermission ? (wod) => handleEdit(wod) : null
          }
          onRemove={
            isDeletepermission.hasPermission
              ? (wod) => onOpenDeleteModal(wod.id)
              : null
          }
        />
      ) : (
        <CatalogCardList.Skeleton />
      )}
      {isOpenModal && (
        <ModalFormikForm
          onClose={onCloseModal}
          isOpenModal={isOpenModal}
          dismissible
          title={editMode ? "Editar Marca" : "Crear Marca"}
          schema={WodFormSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          formFields={<WodFormFields />}
          saveLabel={editMode ? "Actualizar" : "Guardar"}
        />
      )}
      {isOpenDeleteModal && (
        <ModalRemove
          isOpenModal={isOpenDeleteModal}
          onCloseModal={onCloseDeleteModal}
          removeFunction={handleDelete}
        />
      )}
    </div>
  );
};

const ProtectedWodView = withPermission(Wods, "view_wods");

export default ProtectedWodView;
