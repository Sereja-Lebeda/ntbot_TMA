import type { Ticket } from "../types/ticket.types";
import type { UserType } from "../types/user.types";
import type {
  TicketDto,
  CategoryDto,
  UserDto,
  CreateTicketDto,
} from "./api.types";
import { apiFetch } from "./client";
import { buildCategoryMap, mapTicket, mapUser } from "./mappers";

export async function getCategories(
  signal?: AbortSignal,
): Promise<Record<number, string>> {
  const list = await apiFetch<CategoryDto[]>("/cats", { signal });
  return buildCategoryMap(list);
}

export async function getTicketList(signal?: AbortSignal): Promise<Ticket[]> {
  const categories = await getCategories(signal);
  const dtos = await apiFetch<TicketDto[]>("/ticketList", { signal });
  return dtos.map((dto) => mapTicket(dto, categories));
}

export async function getUser(signal?: AbortSignal): Promise<UserType> {
  const user = await apiFetch<UserDto>("/user", { signal });

  return mapUser(user);
}

export async function createTicket(dto: CreateTicketDto): Promise<void> {
  await apiFetch<string>("/ticket", {
    method: "POST",
    body: dto,
  });
}

export async function cancelTicket(ticketId: number): Promise<void> {
  await apiFetch<string>(`/ticket/${ticketId}`, {
    method: "DELETE",
  });
}
