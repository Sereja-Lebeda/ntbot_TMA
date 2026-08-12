import type { Ticket } from "../types/ticket.types";
import { allStatuses } from "./ticketBadgeHelpers";

export default function getTicketQuantity(tickets: Ticket[]) {
  const initial = allStatuses.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<string, number>,
  );
  return tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, initial);
}
