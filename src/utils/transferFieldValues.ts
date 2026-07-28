// utils/transferFieldValues.ts

import type { Action } from "../types/createTicket.type";

export default function transferFieldValues(
  oldAction: Action,
  newAction: Action,
  oldFormData: Record<string, string>,
  oldMultiData: Record<string, string[]>,
): { formData: Record<string, string>; multiData: Record<string, string[]> } {
  // сопоставление по semanticId + проверка options, как обсуждали

  const newFormData: Record<string, string> = {};
  const newMultiData: Record<string, string[]> = {};

  newAction.fields.forEach((field) => {
    if (!field.semanticId) {
      return;
    }

    const oldField = oldAction.fields.find(
      (f) => f.semanticId === field.semanticId,
    );

    if (!oldField) {
      return;
    }

    if (oldField.type !== field.type) return;

    if (oldField?.type === "multi text" || oldField?.type === "multiselect") {
      const oldValue = oldMultiData[oldField.name];

      let filteredValue: string[];

      if (field.options) {
        filteredValue = oldValue.filter((item) =>
          field.options?.includes(item),
        );
      } else {
        filteredValue = oldValue;
      }

      newMultiData[field.name] = filteredValue;
    } else {
      const oldValue = oldFormData[oldField.name];

      let filteredValue: string;

      if (
        !field.options ||
        (field.options && field.options.includes(oldValue))
      ) {
        filteredValue = oldValue;
      } else {
        filteredValue = "";
      }
      newFormData[field.name] = filteredValue;
    }
  });
  return { formData: newFormData, multiData: newMultiData };
}
