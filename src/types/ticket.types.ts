export interface Ticket {
  title: string;
  ticketId: number;
  createDate: string;
  description: string;
  status: StatusType;
  priority: string;
  category: string;
  attachment: boolean;
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
