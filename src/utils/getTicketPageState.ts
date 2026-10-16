import { ApiError } from "../api/client";
import type { Action } from "../types/createTicket.type";
import type { ListStateVariant } from "../types/listState.types";
import type { Ticket } from "../types/ticket.types";

interface GetTicketPageStateProps {
  isLoading: boolean;
  error: Error | null;
  ticket: Ticket | undefined;
  action: Action | undefined;
}

function getTicketPageState({
  isLoading,
  error,
  ticket,
  action,
}: GetTicketPageStateProps): ListStateVariant | null {
  if (isLoading) return "loading";

  if (error) {
    if (error instanceof ApiError && error.status === 401) {
      return "unauthorized";
    }
    return "error";
  }

  if (!ticket) return "ticketNotFound";

  if (!action) return "actionNotFound";

  return null;
}

export default getTicketPageState;
