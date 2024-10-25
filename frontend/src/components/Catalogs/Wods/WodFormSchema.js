import * as Yup from "yup";

export const WodFormSchema = Yup.object().shape({
  name: Yup.string().required("Nombre del WOD es requerido"),
  description: Yup.string(),
  id: Yup.number(),
});
