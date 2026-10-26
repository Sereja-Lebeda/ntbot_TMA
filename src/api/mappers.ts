import type {
  Action,
  FieldType,
  PriorityLevel,
  ValidationType,
} from "../types/createTicket.type";
import type { StatusType, Ticket } from "../types/ticket.types";
import type { UserRole, UserType } from "../types/user.types";
import type {
  CategoryDto,
  CreateTicketDto,
  PriorityDto,
  TicketDto,
  UpdateTicketDto,
  UserDto,
} from "./api.types";

const STATUS_MAP: Record<string, StatusType> = {
  todo: "New",
  inprogress: "In progress",
  onhold: "Paused",
  pendingfeedback: "Pending",
  resolved: "Complete",
  complete: "Closed",
  cancelled: "Cancelled",
  rejected: "Cancelled",
};

const PRIORITY_MAP: Record<string, PriorityLevel> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

const REVERSE_PRIORITY_MAP: Record<NonNullable<PriorityLevel>, PriorityDto> = {
  Low: "low",
  Normal: "normal",
  High: "high",
};

//todo: change base to employee after backend will do it
const ROLE_MAP: Record<string, UserRole> = {
  base: "employee",
  manager: "manager",
  admin: "admin",
};

const FIELDS_MAP: Record<string, FieldType> = {
  text: "short text",
  textarea: "long text",
  select: "select",
  radio: "radio",
  multi_select: "multiselect",
  integer: "short text",
  float: "short text",
  tel: "short text",
  url: "short text",
  date: "short text",
  date_period: "short text",
  datetime: "short text",
  file: "short text",
  user_picker: "short text",
};

const VALIDATION_MAP: Record<string, ValidationType> = {
  tel: "phone",
  url: "url",
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

interface CreateTicketInput {
  action: Action;
  formData: Record<string, string>;
  priority: NonNullable<PriorityLevel>;
}

interface UpdateTicketInput {
  formData: Record<string, string>;
  priority: NonNullable<PriorityLevel>;
}

export function mapCreateTicket({
  action,
  formData,
  priority,
}: CreateTicketInput): CreateTicketDto {
  const ticket = {
    action_id: action.id,
    category_id: action.categoryId,
    subcategory_id: action.subcategoryId,
    ticket_name: action.name,
    priority: REVERSE_PRIORITY_MAP[priority],
    body: formData,
    creation_timestamp: Math.floor(Date.now() / 1000),
  };

  return ticket;
}

export function mapUpdateTicket({
  formData,
  priority,
}: UpdateTicketInput): UpdateTicketDto {
  const ticketUpdate = {
    body: formData,
    priority: REVERSE_PRIORITY_MAP[priority],
  };

  return ticketUpdate;
}

export function mapRole(raw: string): UserRole {
  const role = ROLE_MAP[normalizeKey(raw)];
  if (!role) {
    console.warn("Unknown role role from backend:", raw);
    return "employee";
  }
  return role;
}

export function mapUser(dto: UserDto): UserType {
  const user = {
    id: dto.id,
    name: dto.name,
    role: mapRole(dto.role),
    department: dto.department,
    localIp: dto.local_ip,
    pcName: dto.pc_name,
    remoteAccessDate:
      dto.remote_access_timestamp > 0
        ? formatDate(dto.remote_access_timestamp)
        : "-",
  };
  return user;
}

export function mapFieldType(raw: string, doubling: boolean): FieldType {
  //todo: add cases for new fields
  const field = FIELDS_MAP[raw];
  if (field === "short text" && doubling) return "multi text";
  if (!field) {
    console.warn("Unable to find related field", raw);
    return "short text";
  }

  return field;
}

export function mapValidation(raw: string): ValidationType | undefined {
  const validation = VALIDATION_MAP[raw];

  return validation;
}
