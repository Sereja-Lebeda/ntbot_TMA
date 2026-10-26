import type { Ticket } from "../types/ticket.types";
import type { UserType } from "../types/user.types";
import {
  type TicketDto,
  type CategoryDto,
  type UserDto,
  type CreateTicketDto,
  type UpdateTicketDto,
  type SubcategoryDto,
  type ActionListItemDto,
  type ActionConfigDto,
} from "./api.types";
import { apiFetch } from "./client";
import { buildCategoryMap, mapTicket, mapUser } from "./mappers";
import { withCache } from "./withCache";

export async function getCategories(
  signal?: AbortSignal,
): Promise<Record<number, string>> {
  const list = await getCategoryList(signal);
  return buildCategoryMap(list);
}

export async function getCategoryList(
  signal?: AbortSignal,
): Promise<CategoryDto[]> {
  const categoryList = await withCache("cats", () =>
    apiFetch<CategoryDto[]>(`/cats`, { signal }),
  );
  return categoryList;
}

export async function getTicketList(signal?: AbortSignal): Promise<Ticket[]> {
  const categories = await getCategories(signal);
  const dtos = await apiFetch<TicketDto[]>("/ticketList", { signal });
  return dtos.map((dto) => mapTicket(dto, categories));
}

export async function getSubcategories(
  categoryId: number,
  signal?: AbortSignal,
): Promise<SubcategoryDto[]> {
  const subcategory = await withCache(`cat:${categoryId}`, () =>
    apiFetch<SubcategoryDto[]>(`/cat/${categoryId}`, {
      signal,
    }),
  );
  return subcategory;
}

export async function getActions(
  subcategoryId: number,
  signal?: AbortSignal,
): Promise<ActionListItemDto[]> {
  const action = await withCache(`subcat:${subcategoryId}`, () =>
    apiFetch<ActionListItemDto[]>(`/subcat/${subcategoryId}`, {
      signal,
    }),
  );
  return action;
}

export async function getActionConfig(
  actionId: number,
  signal?: AbortSignal,
): Promise<ActionConfigDto> {
  const config = await withCache(`action:${actionId}`, () =>
    apiFetch<ActionConfigDto>(`/action/${actionId}`, {
      signal,
    }),
  );
  return config;
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

export async function updateTicket(
  ticketId: number,
  dto: UpdateTicketDto,
): Promise<void> {
  await apiFetch<string>(`/ticket/${ticketId}`, {
    method: "PUT",
    body: dto,
  });
}
