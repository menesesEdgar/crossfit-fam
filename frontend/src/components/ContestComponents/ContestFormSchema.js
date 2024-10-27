import * as Yup from 'yup';

const currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);

export const  ContestFormSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido'),
  location: Yup.string().required('Ubicación requerida'),
  startDate: Yup.date().
    min(currentDate, "La fecha de inicio no puede ser pasada")
    .typeError('La fecha de inicio debe ser una fecha')
    .required("Fecha de inicio requerida"),
  endDate: Yup.date().
  min(currentDate, "Fecha de cierre incorrecta")
  .typeError('La fecha de cierre debe ser una fecha'),
  status: Yup.string().required('Estatus de la competencia requerido'),
  organizer: Yup.string().required('Organizador requerido'),
  id: Yup.number(),
});
