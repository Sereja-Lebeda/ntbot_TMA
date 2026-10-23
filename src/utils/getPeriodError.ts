import parseDateInput from "./parseDateInput";

function getPeriodError(from: string, to: string): string | null {
  const fromStamp = parseDateInput(from);
  const toStamp = parseDateInput(to);

  if (from.length === 10 && fromStamp === null)
    return `Проверьте дату в поле "От"`;
  if (to.length === 10 && toStamp === null) return `Проверьте дату в поле "До"`;
  if (fromStamp !== null && toStamp !== null && fromStamp > toStamp) {
    return `Дата "От" позже даты "До"`;
  }
  return null;
}

export default getPeriodError;
