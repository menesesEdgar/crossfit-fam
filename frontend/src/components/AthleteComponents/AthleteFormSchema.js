import * as Yup from "yup";

export const AthleteFormSchema = Yup.object().shape({
  firstName: Yup.string().required("Nombre requerido"),
  lastName: Yup.string().required("Apellido requerido"),
  email: Yup.string()
    .email("El correo electrónico no es válido")
    .required("Correo requerido"),
  phone: Yup.string().matches(
    /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
    "El teléfono debe tener el formato 123-456-7890"
  ),
  birthDate: Yup.date()
    .min("1900-01-01", "La fecha de nacimiento no puede ser menor a 1900")
    .max(new Date(), "Fecha de nacimiento inválida")
    .typeError("Fecha de nacimiento debe ser una fecha")
    .required("La fecha de nacimiento es requerida"),
  gender: Yup.string().required("Género requerido"),
  status: Yup.string(),
  id: Yup.string(),
});
