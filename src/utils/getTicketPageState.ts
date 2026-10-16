import { ApiError } from "../api/client";
import type { ListStateVariant } from "../types/listState.types";
import type { Ticket } from "../types/ticket.types";

interface GetTicketPageStateProps {
  isLoading: boolean;
  error: Error | null;
  ticket: Ticket | undefined;
}

function getTicketPageState({
  isLoading,
  error,
  ticket,
}: GetTicketPageStateProps): ListStateVariant | null {
  if (isLoading) return "loading";

  if (error) {
    if (error instanceof ApiError && error.status === 401) {
      return "unauthorized";
    }
    return "error";
  }

  if (!ticket) return "notFound";

  return null;
}

export default getTicketPageState;
