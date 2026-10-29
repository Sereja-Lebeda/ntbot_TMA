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
  body: Record<string, string | number>;
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

export interface CatalogCategoryDto {
  category_id: number;
  name: string;
  subcategories?: CatalogSubcategoryDto[];
}

export interface CatalogSubcategoryDto {
  subcategory_id: number;
  name: string;
  actions?: CatalogActionDto[];
}

export interface CatalogActionDto {
  action_id: number;
  name: string;
  config?: ActionConfigDto;
}

export interface ActionConfigDto {
  config_id: number;
  has_block_doubling: boolean;
  fields: FieldDto[];
}

export interface CategoryDto {
  category_id: number;
  name: string;
}

export interface SubcategoryDto {
  subcategory_id: number;
  name: string;
  category_id: number;
}

export interface ActionListItemDto {
  action_id: number;
  name: string;
  category_id: number;
  subcategory_id: number;
  config_id: number;
}

// type FieldType = "select" | "textarea" | "";

export interface FieldDto {
  field_id: number;
  semantic_id: number;
  field_name: string;
  field_type: string;
  required: boolean;
  condition: string;
  options: string[] | null;
  doubling: boolean;
  default_value: string;
  position: number;
  block_doubling: boolean;
  hint: string;
  placeholder: string;
  description_mark: boolean;
}
