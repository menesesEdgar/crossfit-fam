import * as Yup from "yup";

export const UserFormSchema = Yup.object().shape({
  firstName: Yup.string().required("El nombre es requerido"),
  lastName: Yup.string().required("El apellido es requerido"),
  email: Yup.string()
    .email("El correo electrónico no es válido")
    .required("El correo electrónico es requerido"),
  password: Yup.string()
    .required("La nueva contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]{8,}$/,
      "La contraseña debe tener al menos una mayúscula, una minúscula y un número"
    ),
  repeatPassword: Yup.string()
    .required("La confirmación de la nueva contraseña es requerida")
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden"),
  phone: Yup.string().matches(
    /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
    "El teléfono debe tener el formato 123-456-7890"
  ),
  status: Yup.string().required("El estado es requerido"),
  id: Yup.string(),
});

export const UserFormInitialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  repeatPassword: "",
  status: "Habilitado",
  category: "",
  id: "",
};

export const UserFormUpdateSchema = Yup.object().shape({
  firstName: Yup.string().required("El nombre es requerido"),
  lastName: Yup.string().required("El apellido es requerido"),
  email: Yup.string()
    .email("El correo electrónico no es válido")
    .required("El correo electrónico es requerido"),
  phone: Yup.string().matches(
    /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
    "El teléfono debe tener el formato 123-456-7890"
  ),
  status: Yup.string().required("El estado es requerido"),
  id: Yup.string(),
});

export const UserFormChangePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("La nueva contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]{8,}$/,
      "La contraseña debe tener al menos una mayúscula, una minúscula y un número"
    ),
  repeatPassword: Yup.string()
    .required("La confirmación de la nueva contraseña es requerida")
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden"),
  id: Yup.string(),
});

export const UserFormAddAthleteSchema = Yup.object().shape({
  firstName: Yup.string().required("El nombre es requerido"),
  lastName: Yup.string().required("El apellido es requerido"),
  email: Yup.string()
    .email("El correo electrónico no es válido")
    .required("El correo electrónico es requerido"),
  phone: Yup.string().matches(
    /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
    "El teléfono debe tener el formato 123-456-7890"
  ),
  status: Yup.string().required("El estado es requerido"),
  id: Yup.string(),
});
