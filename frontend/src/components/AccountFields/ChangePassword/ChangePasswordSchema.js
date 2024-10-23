import * as Yup from 'yup';

export const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('La contraseña actual es requerida'),
  newPassword: Yup.string()
    .required('La nueva contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]{8,}$/,
      'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
    ),
  confirmNewPassword: Yup.string()
    .required('La confirmación de la nueva contraseña es requerida')
    .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas no coinciden'),
});
