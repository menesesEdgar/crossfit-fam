import * as Yup from 'yup';

export const AthleteFormSchema = Yup.object().shape({
  firstName: Yup.string().required('Nombre requerido'),
  lastName: Yup.string().required('Apellido requerido'),
  age: Yup.number()
    .min(5, "Esta muy bebe")
    .max(100, "Estas muy anciano para participar")
    .integer()
    .typeError('La edad es número')
    .required('Edad requerida'),
  gender: Yup.string().required('Género requerido'),
  email: Yup.string().required('Correo requerido'),
  password: Yup.string().required('Contraseña requerida'),
  id: Yup.number(),
});
