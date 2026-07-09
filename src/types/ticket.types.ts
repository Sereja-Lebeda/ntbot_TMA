import type { PriorityLevel } from "./createTicket.type";

export interface Ticket {
  userId: number;
  title: string;
  ticketId: number;
  createDate: string; // TODO: change this to UNIX createStamp
  actionId: number;
  body: Record<string, string>;
  description: string;
  multiBody: Record<string, string[]>;
  status: StatusType;
  priority: PriorityLevel;
  // category: string;
  breadcrumbs: string[];
  // attachment: boolean;
  attachedFiles: TicketAttachmentType;
  department: string; // NOTE: decide from where we will pull this / delete this row
  userName: string; // NOTE: decide from where we will pull this / delete this row
}

export type StatusType =
  | "New"
  | "In progress"
  | "Paused"
  | "Complete"
  | "Closed"
  | "Cancelled";

export interface TicketCardProps {
  ticket: Ticket;
}

export type TicketAttachmentType = {
  name: string;
  url: string;
  uploadedAt: string;
}[];

// Type for ticket sort new/complete/default
export type SortByStatusType = "default" | "new" | "complete";

// View team tickets or mine
export type TicketViewType = "my" | "team";
