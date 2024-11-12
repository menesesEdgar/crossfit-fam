export const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");
  const formatted = cleaned.replace(
    /(\d{3})(\d{3})(\d{1,4})?/,
    (match, p1, p2, p3) => {
      if (p3) {
        return `${p1}-${p2}-${p3}`;
      } else if (p2) {
        return `${p1}-${p2}`;
      } else if (p1) {
        return `${p1}`;
      }
    }
  );
  return formatted;
};
