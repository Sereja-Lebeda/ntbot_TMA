import { validators } from "./validators";
import type { PriorityLevel, Action, Field } from "../types/createTicket.type";

export function validateSingleField(
  field: Field,
  formData: Record<string, string>, // весь объект, не одно значение
  multiData: Record<string, string[]>, // весь объект, не одно значение
): string | undefined {
  if (field.type === "multi text") {
    const values = multiData[field.name] ?? [];

    if (field.required && values.every((v) => !v)) {
      return "Обязательное поле";
    }
    if (field.validation) {
      const hasInvalid = values.some(
        (v) => v && !validators[field.validation!](v),
      );
      if (hasInvalid) return "Неверный формат в одном из полей";
    }
  } else if (field.type === "multiselect") {
    const values = multiData[field.name] ?? [];

    if (field.required && values.length === 0) {
      return "Обязательное поле";
    }
    // multiselect обычно не имеет field.validation (это не текстовый ввод) — проверку формата можно не делать вовсе
  } else {
    const value = formData[field.name];
    if (field.required && !value) {
      return "Обязательное поле";
    }
    if (field.validation && value) {
      const validationResult = validators[field.validation](value);
      if (!validationResult) return "Неверный формат";
    }
  }

  return undefined;
}

export default function validateForm(
  formData: Record<string, string>,
  multiData: Record<string, string[]>,
  priority: PriorityLevel,
  action: Action,
): Record<string, string> {
  const newErrors: Record<string, string> = {};
  action.fields.forEach((field) => {
    const err = validateSingleField(field, formData, multiData);
    if (err) newErrors[field.name] = err;
  });

  if (!priority) {
    newErrors["priority"] = "error"; // текст не важен, раз без подсказки
  }

  return newErrors;
}
