import type { Ticket } from "../types/ticket.types";
import { type TicketDto, type CategoryDto } from "./api.types";
import { apiFetch } from "./client";
import { buildCategoryMap, mapTicket } from "./mappers";

export async function getCategories(
  signal?: AbortSignal,
): Promise<Record<number, string>> {
  const list = await apiFetch<CategoryDto[]>("/cats", signal);
  return buildCategoryMap(list);
}

export async function getTicketList(signal?: AbortSignal): Promise<Ticket[]> {
  const categories = await getCategories(signal);
  const dtos = await apiFetch<TicketDto[]>("/ticketList", signal);
  return dtos.map((dto) => mapTicket(dto, categories));
}
