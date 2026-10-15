import type { PriorityLevel } from "../types/createTicket.type";
import type { StatusType, Ticket } from "../types/ticket.types";
import type { CategoryDto, TicketDto } from "./api.types";

const STATUS_MAP: Record<string, StatusType> = {
  todo: "New",
  inprogress: "In progress",
  onhold: "Paused",
  onapproval: "Complete",
  complete: "Closed",
  cancelled: "Cancelled",
  rejected: "Cancelled",
};

const PRIORITY_MAP: Record<string, PriorityLevel> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

function normalizeKey(raw: string): string {
  //     /.../ границы выражения;
  // [ ... ] «любой один из этих символов»;
  // \s любой пробельный символ, _ и - сами себя;
  // g в конце «заменить все вхождения, а не только первое».
  return raw.toLowerCase().replace(/[\s_-]/g, "");
}

export function mapStatus(raw: string): StatusType {
  const status = STATUS_MAP[normalizeKey(raw)];
  if (!status) {
    console.warn("Unknown status from backend:", raw);
    return "In progress";
  }

  return status;
}

export function mapPriority(raw: string): PriorityLevel {
  const priority = PRIORITY_MAP[normalizeKey(raw)];
  if (!priority) {
    console.warn("Unknown priority from backend:", raw);
    return "Normal";
  }

  return priority;
}

export function formatDate(timestampSec: number): string {
  const date = new Date(timestampSec * 1000);
  return date.toLocaleDateString("ru-RU");
}

export function buildCategoryMap(list: CategoryDto[]): Record<number, string> {
  return Object.fromEntries(list.map((c) => [c.category_id, c.name]));
}

export function mapTicket(
  dto: TicketDto,
  categories: Record<number, string>,
): Ticket {
  const body = dto.body ?? {};

  return {
    userId: dto.user_id,
    title: dto.ticket_name,
    ticketId: dto.ticket_id,
    createDate: formatDate(dto.creation_timestamp),
    createStamp: dto.creation_timestamp * 1000,
    actionId: dto.action_id,
    status: mapStatus(dto.status),
    priority: mapPriority(dto.priority),
    body: dto.body ?? {},
    description: Object.values(body).filter(Boolean).join(" · "),
    breadcrumbs: [categories[dto.category_id] ?? ""],
    multiBody: {},
    attachedFiles: [],
    department: "",
    userName: "",
  };
}
