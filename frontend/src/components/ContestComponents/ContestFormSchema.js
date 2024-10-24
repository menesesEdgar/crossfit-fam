import * as Yup from 'yup';

export const  ContestFormSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido'),
  location: Yup.string().required('Ubicación requerida'),
  startDate: Yup.date().
    min(new Date(), "La fecha de inicio no puede ser pasada")
    .typeError('La fecha de inicio debe ser una fecha')
    .required("Fecha de inicio requerida"),
  endDate: Yup.date(),
  status: Yup.string().required('Estatus de la competencia requerido'),
  organizer: Yup.string().required('Organizador requerido'),
  id: Yup.number(),
});
