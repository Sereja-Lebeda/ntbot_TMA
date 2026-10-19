import isEmptyValue from "./isEmptyValue";

function displayOrDash(value: string | undefined) {
  if (isEmptyValue(value)) {
    return "—";
  }
  return value;
}

export default displayOrDash;
