import type { StatusType, TicketCardProps } from "../types/ticket.types";
import getStatusTitle from "../utils/statusNameHelper";
import { textPressAnimationStyle } from "../styles/pressAnimation";

import AttachIcon from "../icons/card/AttachIcon";
import CancelIcon from "../icons/card/CancelIcon";
import CheckIcon from "../icons/card/CheckIcon";
import CrossIcon from "../icons/card/CrossIcon";
import EditIcon from "../icons/card/EditIcon";
import RepeatIcon from "../icons/card/RepeatIcon";
import TelegramIcon from "../icons/card/TelegramIcon";
import FavoriteIcon from "../icons/card/FavoriteTicketIcon";

interface TicketCardWithActionsProps extends TicketCardProps {
  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
}

export default function TicketCard({
  ticket,
  favoriteTickets,
  setFavoriteTickets,
}: TicketCardWithActionsProps) {
  function getStatusColor(status: StatusType) {
    const baseStyle =
      "h-5 w-auto flex justify-center items-center px-2 py-1.5 rounded-xs text-(--bg-primary-second) font-bold leading-3 select-none";
    switch (status) {
      case "New":
        return `${baseStyle} bg-(--bg-task-new)`;
      case "In progress":
        return `${baseStyle} bg-(--bg-task-inprogress)`;
      case "Paused":
        return `${baseStyle} bg-(--bg-task-paused)`;
      case "Complete":
        return `${baseStyle} bg-(--bg-task-complete)`;
      case "Closed":
        return `${baseStyle} bg-(--bg-task-closed)`;
      case "Cancelled":
        return `${baseStyle} bg-(--bg-task-cancelled)`;
    }
  }

  function getPriorityTitle(priority: string) {
    switch (priority) {
      case "Low":
        return "НИЗКИЙ";
      case "Medium":
        return "СРЕДНИЙ";
      case "High":
        return "ВЫСОКИЙ";
    }
  }

  const favoriteBtn = (
    <FavoriteIcon
      ticketId={ticket.ticketId}
      favoriteTickets={favoriteTickets}
      setFavoriteTickets={setFavoriteTickets}
    />
  );

  function getStatusIcon(status: StatusType): React.ReactNode {
    const baseStyle = "flex items-center gap-2";

    switch (status) {
      case "New":
        return (
          <div className={baseStyle}>
            <CancelIcon /> <EditIcon /> <RepeatIcon /> {favoriteBtn}
            <TelegramIcon className="text-(--text-tertiary) " />
          </div>
        );
      case "In progress":
        return (
          <div className={baseStyle}>
            <RepeatIcon /> {favoriteBtn}
            <TelegramIcon className="text-(--text-tertiary) " />
          </div>
        );
      case "Paused":
        return (
          <div className={baseStyle}>
            <RepeatIcon /> {favoriteBtn}{" "}
            <TelegramIcon className="text-(--text-tertiary) " />
          </div>
        );
      case "Complete":
        return (
          // TODO: Make btns
          <div className="flex items-center gap-2 font-jbmono">
            <span className="text-(--text-primary)  text-xs font-medium leading-3 select-none">
              Заявка выполнена?
            </span>
            <div className={baseStyle}>
              <div className="h-6 bg-(--bg-btn-primary) flex items-center px-1.5 py-0.5 gap-1 rounded-xs select-none">
                <CheckIcon />
                <span className="font-bold leading-3 text-xs text-(--bg-primary-second)">
                  Да
                </span>
              </div>
              <div className="h-6 bg-(--bg-btn-cancel) flex items-center px-1.5 py-0.5 gap-1 rounded-xs select-none">
                <CrossIcon />
                <span className="font-bold leading-3 text-xs text-(--bg-primary-second)">
                  Нет
                </span>
              </div>
            </div>
          </div>
        );
      case "Closed":
        return (
          <div className={baseStyle}>
            <RepeatIcon /> {favoriteBtn}
          </div>
        );
      case "Cancelled":
        return (
          <div className={baseStyle}>
            <RepeatIcon /> {favoriteBtn}
          </div>
        );
    }
  }

  return (
    // white background
    <div className="w-215 h-37 bg-(--text-tertiary) rounded-xs relative select-none">
      <div className="w-full h-full flex flex-col justify-between items-start bg-(--bg-secondary) rounded-xs border border-(--bg-border) px-5 py-3 gap-2 cursor-pointer transition-all duration-600 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:z-10 hover:border-(--text-tertiary)">
        {/* Title and Meta info */}
        <div className="w-full flex justify-between items-center py-0.5">
          {/* title */}
          <div className="flex flex-1 items-center gap-1.5">
            <div className="text-(--text-primary) font-jbmono text-[15px] font-medium leading-6 select-none cursor-pointer">
              {ticket.title}
            </div>
            {ticket.attachment && <AttachIcon />}
          </div>
          {/* meta info */}
          <div className="w-auto flex items-center font-jbmono text-(--text-secondary) text-xs font-medium leading-3 gap-2 select-none">
            <span>ID: </span>
            <div
              onClick={() =>
                navigator.clipboard.writeText(ticket.ticketId.toString())
              }
              className={`flex gap-1.5 hover:text-(--text-primary) ${textPressAnimationStyle}`}
            >
              {ticket.ticketId}
            </div>
            <span>|</span>
            <div>{ticket.createDate}</div>
          </div>
        </div>

        {/* Description */}
        <div className="w-full text-(--text-secondary) text-sm font-consolas font-normal leading-5 line-clamp-2 select-none">
          {ticket.description}
        </div>

        {/* Status, priorirty, category, icons */}
        <div className="w-full py-2 flex justify-between items-center">
          {/* Status, priorirty, category */}
          <div className="flex items-center gap-3 font-jbmono text-xs">
            <div className={getStatusColor(ticket.status)}>
              {getStatusTitle(ticket.status, "singular")}
            </div>
            <div className="h-5 flex justify-center items-center px-2 py-1.5 gap-2.5 border border-(--text-tertiary) text-(--text-tertiary) rounded-xs font-bold leading-3 select-none">
              {getPriorityTitle(ticket.priority)}
            </div>
            <div className="h-6 flex justify-center items-center py-1.5 gap-2.5 font-medium leading-3 text-(--text-tertiary) select-none">
              {ticket.category}
            </div>
          </div>
          {/* icons */}
          {/* TODO: Make icons as buttons and add logic */}
          <div>{getStatusIcon(ticket.status)}</div>
        </div>
      </div>
    </div>
  );
}
