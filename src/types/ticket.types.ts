export interface Ticket {
  userId: number;
  title: string;
  ticketId: number;
  createDate: string;
  description?: string; // TODO: заменить на body: Record<string,string> когда определимся с хранением произвольных полей
  status: StatusType;
  priority: string;
  category: string;
  breadcrumbs: string[];
  // attachment: boolean;
  attachedFiles: TicketAttachmentType;
  department: string;
  userName: string;
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
