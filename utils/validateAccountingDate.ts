export const validateAccountingDate = (date: string | Date) => {
  let inputDate: Date;

  if (typeof date === "string") {
    const [year, month, day] = date.split("-").map(Number);
    inputDate = new Date(year, month - 1, day);
  } else {
    inputDate = new Date(date);
  }

  if (isNaN(inputDate.getTime())) {
    return {
      valid: false,
      message: "Fecha inválida",
    };
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const inputYear = inputDate.getFullYear();
  const inputMonth = inputDate.getMonth();

  if (inputDate > today) {
    return {
      valid: false,
      message: "La fecha no puede ser futura",
    };
  }

  if (inputYear === currentYear && inputMonth === currentMonth) {
    return { valid: true, date: inputDate };
  }

  if (inputYear === currentYear && inputMonth === currentMonth - 1) {
    if (currentDay > 9) {
      return {
        valid: false,
        message:
          "El plazo para registrar en el mes anterior ha finalizado (máximo día 15)",
      };
    }

    return { valid: true, date: inputDate };
  }

  if (
    currentMonth === 0 &&
    inputYear === currentYear - 1 &&
    inputMonth === 11
  ) {
    if (currentDay > 15) {
      return {
        valid: false,
        message:
          "El plazo para registrar en diciembre ha finalizado (máximo día 15 de enero)",
      };
    }

    return { valid: true, date: inputDate };
  }

  return {
    valid: false,
    message: "No se pueden registrar asientos en periodos contables cerrados",
  };
};
