export const isDatePassed = (dateStr: string, startHour: string) => {
  if (!dateStr || !startHour) return false;

  const currentDateTime = new Date();
  const [day, month, year] = dateStr.split('/').map(Number);
  const [hours, minutes] = startHour.split(':').map(Number);
  const inputDateTime = new Date(year, month - 1, day, hours, minutes);

  return inputDateTime < currentDateTime;
};
