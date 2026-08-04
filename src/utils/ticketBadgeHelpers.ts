import type { PriorityLevel } from "../types/createTicket.type";
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
    "xl:h-5 xl:w-auto xl:flex xl:justify-center xl:items-center xl:px-2 xl:py-1.5 xl:rounded-xs xl:dark:text-(--text-btn) xl:text-(--text-primary) xl:text-xs xl:font-jbmono xl:font-bold xl:leading-3 xl:select-none";
  switch (status) {
    case "New":
      return `${baseStyle} xl:bg-(--bg-task-new)`;
    case "In progress":
      return `${baseStyle} xl:bg-(--bg-task-inprogress)`;
    case "Paused":
      return `${baseStyle} xl:bg-(--bg-task-paused)`;
    case "Complete":
      return `${baseStyle} xl:bg-(--bg-task-complete)`;
    case "Closed":
      return `${baseStyle} xl:bg-(--bg-task-closed)`;
    case "Cancelled":
      return `${baseStyle} xl:bg-(--bg-task-cancelled)`;
  }
}

export function getPriorityTitle(priority: PriorityLevel) {
  switch (priority) {
    case "Low":
      return "НИЗКИЙ";
    case "Medium":
      return "СРЕДНИЙ";
    case "High":
      return "ВЫСОКИЙ";
    case null:
      return "";
  }
}

export const allStatuses: StatusType[] = [
  "New",
  "In progress",
  "Paused",
  "Complete",
  "Closed",
  "Cancelled",
];

export function buildStatusLabelMap(): Record<string, StatusType> {
  const map: Record<string, StatusType> = {};
  allStatuses.forEach((status) => {
    const label = getStatusTitle(status, "singular");
    if (!label) {
      return;
    }
    map[label] = status;
  });
  return map;
}
