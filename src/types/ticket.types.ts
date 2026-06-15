export interface Ticket {
  userId: number;
  title: string;
  ticketId: number;
  createDate: string;
  description: string;
  status: StatusType;
  priority: string;
  category: string;
  attachment: boolean;
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

// Type for ticket sort new/complete/default
export type SortByStatusType = "default" | "new" | "complete";

// View team tickets or mine
export type TicketViewType = "my" | "team";
