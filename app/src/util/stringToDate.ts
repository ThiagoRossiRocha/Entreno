export const stringToDate = (dateString: string) => {
  const dateParts = dateString.split("/");
  if (dateParts.length === 3) {
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);

    const date = new Date(year, month, day);

    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}
