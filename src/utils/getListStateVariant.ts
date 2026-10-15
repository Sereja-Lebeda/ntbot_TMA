import { ApiError } from "../api/client";
import type { ListStateVariant } from "../types/listState.types";

interface GetListStateVariantProps {
  isLoading: boolean;
  error: Error | null;
  ticketQuantity: number;
  filteredTicketQuantity: number;
}

function getListStateVariant({
  isLoading,
  error,
  ticketQuantity,
  filteredTicketQuantity,
}: GetListStateVariantProps): ListStateVariant | null {
  if (isLoading) return "loading";

  if (error) {
    if (error instanceof ApiError && error.status === 401) {
      return "unauthorized";
    }
    return "error";
  }

  if (ticketQuantity === 0) return "empty";
  if (filteredTicketQuantity === 0) return "emptyFiltered";

  return null;
}

export default getListStateVariant;
