export const calculateAge = (date) => {
  if (
    date === null ||
    date === undefined ||
    date === "" ||
    date === "0000-00-00"
  ) {
    return null;
  }
  const today = new Date();
  const newDate = date?.split("T")[0];
  if (newDate) {
    const birthDateParts = newDate.split("-");
    if (birthDateParts.length === 3) {
      const birthDateObj = new Date(
        birthDateParts[0],
        birthDateParts[1] - 1,
        birthDateParts[2]
      );
      const age = today.getFullYear() - birthDateObj.getFullYear();
      return age;
    } else {
      console.error(
        "Formato de fecha de nacimiento incorrecto. Debe ser YYYY-MM-DD."
      );
    }
  } else {
    console.error("Fecha de nacimiento no proporcionada.");
  }
};
export function formatDate(dateString) {
  // Split the input date string
  const date = dateString?.split("T")[0];
  if (date) {
    const parts = date.split("-");
    return `${parts[1]}-${parts[2]}-${parts[0]}`;
  }
}

export function formatMxnDate(dateString) {
  // Split the input date string
  const date = dateString?.split("T")[0];
  if (date) {
    const parts = date.split("-");
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
}
