// type TicketStatus = "todo" | "inprogress" | "onhold" | "onapproval" | "complete" | "cancelled" | "rejected"

export type PriorityDto = "low" | "normal" | "high";

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

export interface CreateTicketDto {
  action_id: number;
  category_id: number;
  subcategory_id: number;
  ticket_name: string;
  priority: PriorityDto;
  body: Record<string, string>;
  creation_timestamp: number;
}

export interface UpdateTicketDto {
  priority: PriorityDto;
  body: Record<string, string>;
}

export interface UserDto {
  id: number;
  name: string;
  role: string;
  tg_id: number;
  ticket_ids: number[];
  department: string;
  local_ip: string;
  pc_name: string;
  remote_access_timestamp: number;
}

export interface CategoryDto {
  category_id: number;
  name: string;
}
