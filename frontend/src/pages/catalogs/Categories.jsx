import { useState, useEffect } from "react";
import { useCatalogContext } from "../../context/CatalogContext";

import CatalogCardList from "../../components/CatalogCardList/CatalogCardList";
import useCheckPermissions from "../../hooks/useCheckPermissions";
import withPermission from "../../utils/withPermissions";
import CategoryFormFields from "../../components/Catalogs/Category/CategoryFormFields";
import { CategoryFormSchema } from "../../components/Catalogs/Category/CategoryFormSchema";
import ModalFormikForm from "../../components/Modals/ModalFormikForm";
import ModalRemove from "../../components/Modals/ModalRemove";
import { LiaDumbbellSolid } from "react-icons/lia";

const Categories = () => {
  const isCreatePermission = useCheckPermissions("create_category");
  const isEditPermission = useCheckPermissions("edit_category");
  const isDeletePermission = useCheckPermissions("delete_category");

  const {
    createCategory,
    updateCategory,
    deleteCategory,
    categories: allCategories,
    loading,
  } = useCatalogContext();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [removeCategoryId, setRemoveCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    id: "",
  });

  useEffect(() => {
    setCategories(allCategories);
  }, [allCategories]);

  const handleEdit = (category) => {
    setEditMode(true);
    setInitialValues({
      name: category.name,
      description: category.description || "",
      id: category.id,
    });
    setIsOpenModal(true);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      editMode ? await updateCategory(values) : await createCategory(values);
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
      await deleteCategory(removeCategoryId);
      setIsOpenDeleteModal(false);
      setRemoveCategoryId(null);
    } catch (error) {
      console.error(error);
      setIsOpenDeleteModal(false);
    }
  };

  const onCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
    setRemoveCategoryId(null);
  };

  const onOpenDeleteModal = (category) => {
    setIsOpenDeleteModal(true);
    setRemoveCategoryId(category);
  };

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden">
      {categories && !loading ? (
        <CatalogCardList
          icon={LiaDumbbellSolid}
          data={categories}
          title="Categorias"
          onCreate={
            isCreatePermission.hasPermission ? () => setIsOpenModal(true) : null
          }
          onEdit={
            isEditPermission.hasPermission
              ? (category) => handleEdit(category)
              : null
          }
          onRemove={
            isDeletePermission.hasPermission
              ? (category) => onOpenDeleteModal(category.id)
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
          title={editMode ? "Editar Categoría" : "Crear Categoría"}
          schema={CategoryFormSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          formFields={<CategoryFormFields />}
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

const ProtectedCategoryView = withPermission(Categories, "view_categories");

export default ProtectedCategoryView;
