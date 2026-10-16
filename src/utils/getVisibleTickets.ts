import type { Ticket, TicketViewType } from "../types/ticket.types";
import type { UserType } from "../types/user.types";

interface GetVisibleTicketsProps {
  tickets: Ticket[];
  user: UserType | null;
  ticketView: TicketViewType;
}

function getVisibleTickets({
  tickets,
  user,
  ticketView,
}: GetVisibleTicketsProps): Ticket[] {
  if (!user) return [];

  if (ticketView === "my") {
    return tickets.filter((ticket) => ticket.userId === user.id);
  }

  const othersTickets = tickets.filter((ticket) => ticket.userId !== user.id);

  if (user.role === "admin") return othersTickets;

  if (user.role === "manager") {
    return othersTickets.filter(
      (ticket) => ticket.department === user.department,
    );
  }

  return [];
}

export default getVisibleTickets;
