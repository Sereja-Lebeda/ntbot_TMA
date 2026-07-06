import type { StatusType } from "../types/ticket.types";

type FormType = "plural" | "singular" | "statusBlock" | "infoBlock";

const titles: Record<string, Record<FormType, string>> = {
  New: {
    singular: "НОВАЯ",
    plural: "НОВЫХ",
    statusBlock: "Новые",
    infoBlock: "новых",
  },
  "In progress": {
    singular: "В РАБОТЕ",
    plural: "В РАБОТЕ",
    statusBlock: "В работе",
    infoBlock: "в работе",
  },
  Paused: {
    singular: "НА ПАУЗЕ",
    plural: "НА ПАУЗЕ",
    statusBlock: "На паузе",
    infoBlock: "на паузе",
  },
  Complete: {
    singular: "ГОТОВА",
    plural: "ГОТОВЫХ",
    statusBlock: "Готовы",
    infoBlock: "готова",
  },
  Closed: {
    singular: "ЗАКРЫТО",
    plural: "ЗАКРЫТЫХ",
    statusBlock: "Закрыты",
    infoBlock: "закрыто",
  },
  Cancelled: {
    singular: "ОТКЛОНЕНА",
    plural: "ОТКЛОНЁННЫХ",
    statusBlock: "Отклонены",
    infoBlock: "отклонена",
  },
};

export default function getStatusTitle(status: string, form: FormType) {
  return titles[status]?.[form];
}
export function getStatusColor(status: StatusType) {
  const baseStyle =
    "h-5 w-auto flex justify-center items-center px-2 py-1.5 rounded-xs dark:text-(--text-btn) text-(--text-primary) font-bold leading-3 select-none";
  switch (status) {
    case "New":
      return `${baseStyle} bg-(--bg-task-new)`;
    case "In progress":
      return `${baseStyle} bg-(--bg-task-inprogress)`;
    case "Paused":
      return `${baseStyle} bg-(--bg-task-paused)`;
    case "Complete":
      return `${baseStyle} bg-(--bg-task-complete)`;
    case "Closed":
      return `${baseStyle} bg-(--bg-task-closed)`;
    case "Cancelled":
      return `${baseStyle} bg-(--bg-task-cancelled)`;
  }
}

export function getPriorityTitle(priority: string) {
  switch (priority) {
    case "Low":
      return "НИЗКИЙ";
    case "Medium":
      return "СРЕДНИЙ";
    case "High":
      return "ВЫСОКИЙ";
  }
}
