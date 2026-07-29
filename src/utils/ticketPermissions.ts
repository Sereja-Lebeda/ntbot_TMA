import type { Ticket } from "../types/ticket.types";
import type { UserType } from "../types/user.types";

export function getTicketPermissions(ticket: Ticket, currentUser: UserType) {
  //admin
  if (currentUser.role === "admin") {
    return { canEdit: true, canCancel: true, canChangeStatus: true };
  }

  const isOwnTicket = currentUser.id === ticket.userId;
  const isNew = ticket.status === "New";

  //manager
  if (
    !isOwnTicket &&
    currentUser.role === "manager" &&
    ticket.department === currentUser.department
  ) {
    return { canEdit: isNew, canCancel: isNew, canChangeStatus: false };
  }

  //employee
  return {
    canEdit: isOwnTicket && isNew,
    canCancel: isOwnTicket && isNew,
    canChangeStatus: false,
  };
}
