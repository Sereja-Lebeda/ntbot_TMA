import type { Action } from "../types/createTicket.type";

export default function getTicketDescription(
  formData: Record<string, string>,
  action: Action,
): string {
  const shortTextField = action.fields.find((f) => f.type === "short text");
  if (shortTextField && formData[shortTextField.name]) {
    return formData[shortTextField.name];
  }

  const longTextField = action.fields.find((f) => f.type === "long text");
  if (longTextField && formData[longTextField.name]) {
    return formData[longTextField.name];
  }

  return "";
}
