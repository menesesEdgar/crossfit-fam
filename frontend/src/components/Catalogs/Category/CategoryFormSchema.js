import * as Yup from "yup";

export const CategoryFormSchema = Yup.object().shape({
  name: Yup.string().required("El nombre de la categoría es requerido"),
  division: Yup.string().required("La división es requerida"),
  id: Yup.number(),
});
