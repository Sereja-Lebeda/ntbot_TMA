import type { ValidationType } from "../types/createTicket.type";

export const validators: Record<ValidationType, (value: string) => boolean> = {
  url: (value) => /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value),
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^\d{11}$/.test(value), // NOTE: Покрывает форматы +371 12345678, (123) 456-7890
  path: (value) => /^[a-zA-Z]:\\(?:[^\\/:*?"<>|\r\n]+\\?)*$/.test(value),
};
