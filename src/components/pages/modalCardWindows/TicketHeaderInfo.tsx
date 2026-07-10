import FavoriteTicketIcon from "../../../icons/card/FavoriteTicketIcon";
import type { Ticket } from "../../../types/ticket.types";
import getStatusTitle, {
  getStatusColor,
  getPriorityTitle,
} from "../../../utils/ticketBadgeHelpers";

interface TicketHeaderInfoProps {
  ticket: Ticket | undefined;
  className?: string;

  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
  modalMode?: modalModeType;
}

type modalModeType = "view" | "edit";

function TicketHeaderInfo({
  ticket,
  className,
  favoriteTickets,
  setFavoriteTickets,
  modalMode,
}: TicketHeaderInfoProps) {
  if (!ticket) return null;

  return (
    // Ticket header and content

    // Header
    <div
      className={`w-full flex flex-col items-start gap-1 px-12.5 ${className}`}
    >
      {/* Title ticket */}
      <div className="w-full flex justify-start items-center gap-2">
        {/* Icon */}
        <button className="cursor-pointer">
          <FavoriteTicketIcon
            ticketId={ticket.ticketId}
            favoriteTickets={favoriteTickets}
            setFavoriteTickets={setFavoriteTickets}
          />
        </button>
        {/* Title, status, priority */}
        <div className=" w-full flex justify-start items-center gap-3 py-3">
          <span className="font-jbmono font-medium text-[15px] text-(--text-primary) leading-6">
            {ticket.title}
          </span>
          <div className={`${getStatusColor(ticket.status)}`}>
            {getStatusTitle(ticket.status, "singular")}
          </div>
          <div
            className="h-5 flex justify-center items-center px-2 py-1.5 gap-2.5
            bg-(--text-primary) text-(--bg-primary) text-xs
            dark:bg-transparent dark:border dark:border-(--text-tertiary) dark:text-(--text-tertiary)
            rounded-xs font-bold leading-3 select-none"
          >
            {getPriorityTitle(ticket.priority)}
          </div>
        </div>
      </div>
      {/* Ticket meta info */}
      <div
        className="w-full flex justify-start items-center
            font-consolas font-normal text-[11px] text-(--text-secondary) leading-4"
      >
        {`ID: ${ticket.ticketId} | Дата создания: ${ticket.createDate} | Автор: ${ticket.userName}`}
      </div>

      {modalMode === "edit" ? (
        <div className="w-full h-px bg-(--bg-disable-btn) mt-2"></div>
      ) : null}
    </div>
  );
}

export default TicketHeaderInfo;
