function isEmptyValue(value: string | undefined) {
  if (value === undefined || value.trim() === "") {
    return true;
  }
  return false;
}

export default isEmptyValue;
