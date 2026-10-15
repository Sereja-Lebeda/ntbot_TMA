// type TicketStatus = "todo" | "inprogress" | "onhold" | "onapproval" | "complete" | "cancelled" | "rejected"

// type TicketPriority = "low" | "normal" | "high"

export interface TicketDto {
  ticket_id: number;
  ticket_name: string;
  user_id: number;
  category_id: number;
  subcategory_id: number;
  action_id: number;
  status: string;
  priority: string;
  creation_timestamp: number;
  msg_ids: number[] | null;
  body: Record<string, string>;
}

export interface UserDto {
  id: number;
  name: string;
  role: string;
  tg_id: number;
  ticket_ids: number[];
}

export interface CategoryDto {
  category_id: number;
  name: string;
}
