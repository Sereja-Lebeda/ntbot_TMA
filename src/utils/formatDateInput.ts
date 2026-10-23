function formatDateInput(value: string): string {
  const tmpDate = value.replace(/\D/g, "").slice(0, 8);
  const day = tmpDate.slice(0, 2);
  const month = tmpDate.slice(2, 4);
  const year = tmpDate.slice(4);

  const date = [day, month, year].filter(Boolean).join(".");

  return date;
}

export default formatDateInput;
