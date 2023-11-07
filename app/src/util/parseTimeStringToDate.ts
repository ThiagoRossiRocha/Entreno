export const parseTimeStringToDate = (timeString: string) => {
  const timeRegex = /^(\d{2}):(\d{2})$/; // Padrão HH:mm
  const match = timeString.match(timeRegex);

  if (match) {
    const [, hours, minutes] = match;
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date;
  }

  return null;
}
