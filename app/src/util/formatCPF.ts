export const formatCPF = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');
  const match = cleanedValue.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);

  if (match) {
    const formattedValue = match[1] + (match[2] ? '.' + match[2] : '') + (match[3] ? '.' + match[3] : '') + (match[4] ? '-' + match[4] : '');
    return formattedValue;
  }

  return value;
};
