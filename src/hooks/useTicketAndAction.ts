import type { Action } from "../types/createTicket.type";
import type { Ticket } from "../types/ticket.types";

interface useTicketAndActionProps {
  ticketId: number | undefined;
  tickets: Ticket[];
  allActions: Action[];
}

function useTicketAndAction({
  ticketId,
  tickets,
  allActions,
}: useTicketAndActionProps): {
  ticket: Ticket | undefined;
  action: Action | undefined;
} {
  if (ticketId === undefined) return { ticket: undefined, action: undefined };

  const ticket = tickets.find((t) => t.ticketId === ticketId);
  const action = ticket
    ? allActions.find((a) => a.id === ticket.actionId)
    : undefined;

  return { ticket, action };
}

export default useTicketAndAction;
