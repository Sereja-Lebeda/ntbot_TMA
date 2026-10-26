function parseDateInput(dateStr: string): number | null {
  const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

  if (!dateRegex.test(dateStr)) return null;

  const [day, month, year] = dateStr.split(".").map(Number);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date.getTime();
}

export default parseDateInput;
