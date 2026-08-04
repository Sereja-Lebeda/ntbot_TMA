import useUser from "../hooks/useUser";

import type {
  Ticket,
  StatusType,
  TicketCardProps,
} from "../types/ticket.types";

import CardActionButton from "./ui/Buttons/CardActionButton";

import getStatusTitle from "../utils/ticketBadgeHelpers";
import { getStatusColor } from "../utils/ticketBadgeHelpers";
import { getPriorityTitle } from "../utils/ticketBadgeHelpers";
import { getTicketPermissions } from "../utils/ticketPermissions";

import { textPressAnimationStyle } from "../styles/pressAnimation";
import { shadowLiftCardStyle } from "../styles/shadowLift";

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
  ticketView: string;
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  onRequestCancel: (ticketId: number) => void;
  onRequestRepeat: (ticketId: number) => void;
  onRequestEdit: (ticketId: number) => void;
  handleOpenView: (ticketId: number) => void;
}

type actionRegistryType = "cancel" | "edit" | "repeat" | "telegram";

const statusActions: Record<StatusType, actionRegistryType[]> = {
  New: ["cancel", "edit", "repeat", "telegram"],
  "In progress": ["repeat", "telegram"],
  Paused: ["repeat", "telegram"],
  Closed: ["repeat"],
  Cancelled: ["repeat"],
  Complete: [],
};

export default function TicketCard({
  ticket,
  favoriteTickets,
  setFavoriteTickets,
  ticketView,
  setTickets,
  onRequestCancel,
  onRequestRepeat,
  onRequestEdit,
  handleOpenView,
}: TicketCardWithActionsProps) {
  const currentUser = useUser();
  if (!currentUser) return null;
  const permissions = getTicketPermissions(ticket, currentUser);

  const favoriteBtn = (
    <FavoriteIcon
      ticketId={ticket.ticketId}
      favoriteTickets={favoriteTickets}
      setFavoriteTickets={setFavoriteTickets}
    />
  );

  const actionRegistry = {
    cancel: {
      Icon: CancelIcon,
      onClick: () => onRequestCancel(ticket.ticketId),
    },
    edit: {
      Icon: EditIcon,
      onClick: () => onRequestEdit(ticket.ticketId),
    },
    repeat: {
      Icon: RepeatIcon,
      onClick: () => onRequestRepeat(ticket.ticketId),
    },
    telegram: {
      Icon: TelegramIcon,
      onClick: () => console.log("TODO: telegram", ticket.ticketId),
    },
  };

  function getStatusIcon(status: StatusType): React.ReactNode {
    const baseStyle = "flex items-center gap-2";

    //todo: make auto "yes" answer after 48h if user didnt choose
    if (status === "Complete") {
      return (
        <div className="xl:flex xl:items-center xl:gap-2 xl:font-jbmono">
          <span className="xl:text-(--text-primary) xl:text-xs xl:font-medium xl:leading-3 xl:select-none">
            Заявка выполнена?
          </span>
          <div className={`${baseStyle} `}>
            <button
              className="xl:h-6 xl:bg-(--bg-task-complete) xl:dark:bg-(--bg-btn-primary) xl:flex xl:items-center xl:px-1.5 xl:py-0.5 xl:gap-1 xl:rounded-xs xl:select-none xl:cursor-pointer xl:hover:bg-(--text-primary) xl:group"
              onClick={() =>
                setTickets((prev) =>
                  prev.map((t) =>
                    t.ticketId === ticket.ticketId
                      ? { ...t, status: "Closed" }
                      : t,
                  ),
                )
              }
            >
              <CheckIcon className="xl:text-(--text-primary) xl:group-hover:text-(--bg-primary) xl:dark:text-(--bg-primary)" />
              <span className="xl:font-bold xl:leading-3 xl:text-xs xl:text-(--text-primary) xl:group-hover:text-(--bg-primary) xl:dark:text-(--bg-primary)">
                Да
              </span>
            </button>
            <button
              // onClick={() => }
              className="xl:h-6 xl:bg-(--bg-task-cancelled) xl:dark:bg-(--bg-task-cancelled) xl:flex xl:items-center xl:px-1.5 xl:py-0.5 xl:gap-1 xl:rounded-xs xl:select-none xl:cursor-pointer xl:hover:bg-(--text-primary) xl:group"
              onClick={() =>
                setTickets((prev) =>
                  prev.map((t) =>
                    t.ticketId === ticket.ticketId
                      ? { ...t, status: "In progress" }
                      : t,
                  ),
                )
              }
            >
              <CrossIcon className="xl:w-2.5 xl:h-2.5 xl:text-(--text-primary) xl:group-hover:text-(--bg-primary) xl:dark:text-(--bg-primary)" />
              <span className="xl:font-bold xl:leading-3 xl:text-xs xl:text-(--text-primary) xl:group-hover:text-(--bg-primary) xl:dark:text-(--bg-primary)">
                Нет
              </span>
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className={baseStyle}>
        {statusActions[status]
          .filter((key) => key !== "telegram")
          .filter((key) => {
            if (key === "cancel") {
              return permissions.canCancel;
            }
            if (key === "edit") {
              return permissions.canEdit;
            }

            return true;
          })
          .map((key) => {
            const { Icon, onClick } = actionRegistry[key];
            return (
              <CardActionButton
                key={key}
                onClick={onClick}
                className="xl:cursor-pointer"
              >
                <Icon />
              </CardActionButton>
            );
          })}
        <CardActionButton className="xl:cursor-pointer">
          {favoriteBtn}
        </CardActionButton>
        {statusActions[status].includes("telegram") && (
          <CardActionButton onClick={actionRegistry.telegram.onClick}>
            <TelegramIcon className="xl:text-(--text-tertiary) xl:cursor-pointer" />
          </CardActionButton>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => handleOpenView(ticket.ticketId)}
      className={`xl:w-full xl:px-5 xl:py-3 xl:gap-2 xl:rounded-xs xl:cursor-pointer
        xl:flex xl:flex-col xl:justify-between xl:items-start
      ${ticketView === "my" ? "xl:h-38" : "xl:h-47 "}
      ${shadowLiftCardStyle}
      xl:bg-(--bg-secondary) xl:border border-(--bg-border)
      xl:hover:border-(--text-tertiary)
      xl:relative xl:select-none xl:shrink-0
      `}
    >
      {/* Title, dep, employee name and Meta info as manager*/}
      {ticketView === "team" ? (
        <div className="xl:w-full xl:flex xl:flex-col xl:gap-2">
          {/* Строка 1: имя/отдел и ID/дата */}
          <div className="xl:w-full xl:flex xl:justify-between xl:items-center">
            <div className="xl:flex xl:items-center xl:gap-2 xl:text-(--text-secondary) xl:text-xs xl:font-jbmono xl:font-medium xl:leading-3">
              {ticket.userName}
              <span>|</span>
              {ticket.department}
            </div>
            <div className="xl:w-auto xl:flex xl:items-center xl:font-jbmono xl:text-(--text-secondary) xl:text-xs xl:font-medium xl:leading-3 xl:gap-2 xl:select-none">
              <span>ID: </span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(ticket.ticketId.toString());
                }}
                className={`xl:flex xl:gap-1.5 xl:hover:text-(--text-primary) ${textPressAnimationStyle}`}
              >
                {ticket.ticketId}
              </div>
              <span>|</span>
              <div>{ticket.createDate}</div>
            </div>
          </div>
          {/* Строка 2: заголовок */}
          <div className="xl:flex xl:flex-1 xl:items-center xl:gap-1.5 xl:min-w-0">
            <div className="xl:text-(--text-primary) xl:font-jbmono xl:text-[15px] xl:font-medium xl:leading-6 xl:select-none xl:cursor-pointer xl:truncate">
              {ticket.title}
            </div>
            {ticket.attachedFiles.length > 0 && (
              <AttachIcon className="xl:shrink-0" />
            )}
          </div>
        </div>
      ) : (
        // Title and Meta info as user
        <div className="xl:w-full xl:flex xl:justify-between xl:items-center xl:py-0.5">
          {/* title */}
          <div className="xl:flex xl:flex-1 xl:items-center xl:gap-1.5 xl:min-w-0">
            <div className="xl:text-(--text-primary) xl:font-jbmono xl:text-[15px] xl:font-medium xl:leading-6 xl:select-none xl:cursor-pointer xl:truncate">
              {ticket.title}
            </div>
            {ticket.attachedFiles.length > 0 && (
              <AttachIcon className="xl:shrink-0" />
            )}
          </div>
          {/* meta info */}
          <div className="xl:w-auto xl:flex xl:items-center xl:font-jbmono xl:text-(--text-secondary) xl:text-xs xl:font-medium xl:leading-3 xl:gap-2 xl:select-none">
            <span>ID: </span>
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(ticket.ticketId.toString());
              }}
              className={`xl:flex xl:gap-1.5 xl:hover:text-(--text-primary) ${textPressAnimationStyle}`}
            >
              {ticket.ticketId}
            </div>
            <span>|</span>
            <div>{ticket.createDate}</div>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="xl:w-full xl:flex-1 xl:h-10 xl:text-(--text-secondary) xl:text-sm xl:font-consolas xl:font-normal xl:leading-5 xl:line-clamp-2 xl:select-none">
        {ticket.description}
      </div>

      {/* Status, priorirty, category, icons */}
      <div className="xl:w-full xl:py-2 xl:flex xl:justify-between xl:items-center">
        {/* Status, priorirty, category */}
        <div className="xl:flex xl:items-center xl:gap-3 xl:font-jbmono xl:text-xs">
          <div className={getStatusColor(ticket.status)}>
            {getStatusTitle(ticket.status, "singular")}
          </div>
          <div className="xl:h-5 xl:flex xl:justify-center xl:items-center xl:px-2 xl:py-1.5 xl:gap-2.5 xl:bg-(--text-primary) xl:text-(--bg-primary) xl:dark:bg-transparent xl:dark:border xl:dark:border-(--text-tertiary) xl:dark:text-(--text-tertiary) xl:rounded-xs xl:font-bold xl:leading-3 xl:select-none">
            {getPriorityTitle(ticket.priority)}
          </div>
          <div className="xl:h-6 xl:flex xl:justify-center xl:items-center xl:py-1.5 xl:gap-2.5 xl:font-medium xl:leading-3 xl:text-(--text-tertiary) xl:select-none">
            {ticket.breadcrumbs[0]}
          </div>
        </div>
        {/* icons */}
        <div>{getStatusIcon(ticket.status)}</div>
      </div>
    </div>
  );
}
