import type { StatusType, Ticket } from "../../../types/ticket.types";

import getStatusTitle, {
  getStatusColor,
  getPriorityTitle,
  buildStatusLabelMap,
} from "../../../utils/ticketBadgeHelpers";

import StatusDropdown from "../../ui/StaturDropdown";

import { textPressAnimationStyle } from "../../../styles/pressAnimation";

import FavoriteTicketIcon from "../../../icons/card/FavoriteTicketIcon";

interface TicketHeaderInfoProps {
  ticket: Ticket | undefined;
  className?: string;

  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
  modalMode?: modalModeType;

  onStatusChange?: (newStatus: StatusType) => void;
  currentStatus?: StatusType;
}

type modalModeType = "view" | "edit";

function TicketHeaderInfo({
  ticket,
  className,
  favoriteTickets,
  setFavoriteTickets,
  modalMode,
  onStatusChange,
  currentStatus,
}: TicketHeaderInfoProps) {
  if (!ticket) return null;

  const displayStatus = currentStatus ?? ticket.status;

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

          {onStatusChange ? (
            <StatusDropdown
              options={Object.keys(buildStatusLabelMap())}
              onChange={(selectedLabel) => {
                const status = buildStatusLabelMap()[selectedLabel];
                if (status) {
                  onStatusChange(status);
                }
              }}
              value={getStatusTitle(displayStatus, "singular")}
              badgeClassName={getStatusColor(displayStatus)}
            />
          ) : (
            <div className={getStatusColor(displayStatus)}>
              {getStatusTitle(displayStatus, "singular")}
            </div>
          )}

          <div
            className="h-5 flex justify-center items-center px-2 py-1.5 gap-2.5
            bg-(--text-primary) text-(--bg-primary) text-xs
            dark:bg-transparent dark:border dark:border-(--text-tertiary) dark:text-(--text-tertiary)
            rounded-xs font-jbmono font-bold leading-3 select-none"
          >
            {getPriorityTitle(ticket.priority)}
          </div>
        </div>
      </div>
      {/* Ticket meta info */}
      <div
        className="w-full flex justify-start items-center gap-1
            font-consolas font-normal text-[11px] text-(--text-secondary) leading-4"
      >
        <span>ID:</span>
        <span
          onClick={() => {
            navigator.clipboard.writeText(`${ticket.ticketId}`);
          }}
          className={`${textPressAnimationStyle} cursor-pointer`}
        >
          {ticket.ticketId}
        </span>
        <span>{`| Дата создания: ${ticket.createDate}`}</span>
        <span>{`| Автор: ${ticket.userName}`}</span>
      </div>

      {modalMode === "edit" ? (
        <div className="w-full h-px bg-(--bg-disable-btn) mt-2"></div>
      ) : null}
    </div>
  );
}

export default TicketHeaderInfo;
