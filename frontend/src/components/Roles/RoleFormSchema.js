import * as Yup from 'yup';

export const RoleFormSchema = Yup.object().shape({
  name: Yup.string().required('El nombre es requerido'),
  id: Yup.number(),
});
