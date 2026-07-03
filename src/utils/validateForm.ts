import { validators } from "./validators";
import type { PriorityLevel, Action } from "../types/createTicket.type";

export default function validateForm(
  formData: Record<string, string>,
  multiData: Record<string, string[]>,
  priority: PriorityLevel,
  action: Action,
): Record<string, string> {
  const newErrors: Record<string, string> = {};
  action.fields.forEach((field) => {
    if (field.type === "multi text") {
      const values = multiData[field.name] ?? [];

      // required: хотя бы одно непустое?
      if (field.required && values.every((v) => !v)) {
        newErrors[field.name] = "Обязательное поле";
      }

      // формат: каждый непустой элемент валиден?
      if (field.validation) {
        const hasInvalid = values.some(
          (v) => v && !validators[field.validation!](v),
        );
        if (hasInvalid) {
          newErrors[field.name] = "Неверный формат в одном из полей";
        }
      }
    } else {
      const value = formData[field.name];
      if (field.required && !value) {
        newErrors[field.name] = "Обязательное поле";
      }

      if (field.validation && value) {
        const validationResult = validators[field.validation](value);

        if (!validationResult) {
          newErrors[field.name] = "Неверный формат";
        }
      }
    }
  });

  if (!priority) {
    newErrors["priority"] = "error"; // текст не важен, раз без подсказки
  }

  return newErrors;
}
