import type { StatusType, Ticket } from "../../../types/ticket.types";

import getStatusTitle, {
  getStatusColor,
  getPriorityTitle,
  buildStatusLabelMap,
} from "../../../utils/ticketBadgeHelpers";

import StatusDropdown from "../../ui/StatusDropdown";

import { textPressAnimationStyle } from "../../../styles/pressAnimation";

import FavoriteTicketIcon from "../../../icons/card/FavoriteTicketIcon";
import useMediaQuery from "../../../hooks/useMediaQuery";

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
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  if (!ticket) return null;

  const displayStatus = currentStatus ?? ticket.status;

  function handleToggleFavorite(ticketId: number) {
    if (favoriteTickets?.includes(ticketId)) {
      const newFavorite = favoriteTickets.filter((i) => i !== ticketId);
      setFavoriteTickets(newFavorite);
    } else {
      setFavoriteTickets([...(favoriteTickets ?? []), ticketId]);
    }
  }

  return (
    // Ticket header and content
    <>
      {isDesktop ? (
        <div
          className={`xl:w-full xl:flex xl:flex-col xl:items-start xl:gap-1 xl:px-12.5 ${className}`}
        >
          {/* Title ticket */}
          <div className="xl:w-full xl:flex xl:justify-start xl:items-center xl:gap-2">
            {/* Icon */}
            <button
              onClick={() => handleToggleFavorite(ticket.ticketId)}
              className="xl:cursor-pointer"
            >
              <FavoriteTicketIcon
                ticketId={ticket.ticketId}
                favoriteTickets={favoriteTickets}
              />
            </button>
            {/* Title, status, priority */}
            <div className="xl:w-full xl:flex xl:justify-start xl:items-center xl:gap-3 xl:py-3">
              <span className="xl:font-jbmono xl:font-medium xl:text-[15px] xl:text-(--text-primary) xl:leading-6">
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

              <div className="xl:h-5 xl:flex xl:justify-center xl:items-center xl:px-2 xl:py-1.5 xl:gap-2.5 xl:bg-(--text-primary) xl:text-(--bg-primary) xl:text-xs xl:dark:bg-transparent xl:dark:border xl:dark:border-(--text-tertiary) xl:dark:text-(--text-tertiary) xl:rounded-xs xl:font-jbmono xl:font-bold xl:leading-3 xl:select-none">
                {getPriorityTitle(ticket.priority)}
              </div>
            </div>
          </div>
          {/* Ticket meta info */}
          <div className="xl:w-full xl:flex xl:justify-start xl:items-center xl:gap-1 xl:font-consolas xl:font-normal xl:text-[11px] xl:text-(--text-secondary) xl:leading-4">
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
            <div className="xl:w-full xl:h-px xl:bg-(--bg-disable-btn) xl:mt-2"></div>
          ) : null}
        </div>
      ) : (
        <div className="w-full flex flex-col items-start gap-3">
          {/* Ticket title */}
          <div className="w-full flex justify-start items-center gap-3">
            <span className="font-jbmono font-normal text-2xl text-(--text-primary) leading-6 line-clamp-3">
              {ticket.title}
            </span>
          </div>

          {/* Ticket meta info */}
          <div className="w-full flex justify-start items-center gap-1 font-consolas font-normal text-[11px] text-(--text-secondary) leading-4">
            <span>ID:</span>
            <span
              onClick={() => {
                navigator.clipboard.writeText(`${ticket.ticketId}`);
              }}
              className={`${textPressAnimationStyle} cursor-pointer`}
            >
              {ticket.ticketId}
            </span>
            <span>{`| ${ticket.createDate}`}</span>
            <span>{`| ${ticket.userName}`}</span>
          </div>

          {/* Ticket badges */}
          <div className="w-full flex justify-start items-center gap-3">
            {/* Status */}
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

            {/* Priority */}
            <div className="h-5 flex justify-center items-center px-2 py-1.5 gap-2.5 bg-(--text-primary) text-(--bg-primary) text-xs dark:bg-transparent dark:border dark:border-(--text-tertiary) dark:text-(--text-tertiary) rounded-xs font-jbmono font-bold leading-3 select-none">
              {getPriorityTitle(ticket.priority)}
            </div>

            {/* Favorite btn */}
            {/* Icon */}
            <button
              onClick={() => handleToggleFavorite(ticket.ticketId)}
              className="cursor-pointer"
            >
              <FavoriteTicketIcon
                ticketId={ticket.ticketId}
                favoriteTickets={favoriteTickets}
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TicketHeaderInfo;
