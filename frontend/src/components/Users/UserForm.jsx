import React from 'react';
import { FormikProvider, useFormik, Form } from 'formik';
import { UserFormSchema } from './UserFormSchema';
import UserFormFields from './UserFormFields';
import { Button } from 'flowbite-react';
import { FaRegTrashAlt, FaSave } from 'react-icons/fa';

const UserForm = ({ initialValues, roles, onSubmit, isUpdate = false }) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: UserFormSchema,
    onSubmit: (values, actions) => {
      try {
        onSubmit(values, actions);
      } catch (error) {
        console.log('error on UserForm', error);
      } finally {
        actions.setSubmitting(false);
      }
    },
  });
  return (
    <FormikProvider value={formik}>
      <Form className="space-y-4" onSubmit={formik.handleSubmit}>
        <UserFormFields roles={roles} />
        <div className="flex justify-end items-center space-x-4 pt-4">
          <Button type="button" color="gray" onClick={() => formik.resetForm()}>
            <FaRegTrashAlt size={20} className="mr-2" />
            Limpiar
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            color={formik.isSubmitting ? 'gray' : 'purple'}
            isProcessing={formik.isSubmitting}
          >
            <>
              <FaSave size={20} className="mr-2" />
              {isUpdate ? 'Actualizar ' : ' Crear '} Usuario
            </>
          </Button>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default React.memo(UserForm);
