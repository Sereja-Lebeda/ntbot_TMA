import { useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import useMediaQuery from "../hooks/useMediaQuery";

import { useLongPress } from "use-long-press";

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
import FavoriteTicketIcon from "../icons/card/FavoriteTicketIcon";

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

type actionRegistryType =
  | "cancel"
  | "edit"
  | "repeat"
  | "favorite"
  | "telegram";

const statusActions: Record<StatusType, actionRegistryType[]> = {
  New: ["cancel", "edit", "repeat", "favorite", "telegram"],
  "In progress": ["repeat", "favorite", "telegram"],
  Paused: ["repeat", "favorite", "telegram"],
  Closed: ["repeat", "favorite"],
  Cancelled: ["repeat", "favorite"],
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
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isTouchDevice = useMediaQuery("(pointer: coarse)");

  // Long press for dropdown in mobile ver
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const bind = useLongPress(
    () => {
      setIsActionsOpen(true); // сработает через `threshold` мс удержания
    },
    {
      threshold: 500, // сколько мс считать долгим нажатием
      cancelOnMovement: 15, // если палец сдвинулся больше 15px — это свайп, не долгое нажатие; отменяем
      onCancel: (event, meta) => {
        // сработает, если отпустили РАНЬШЕ threshold — то есть это был короткий тап
        if (meta.reason === "cancelled-by-release")
          handleOpenView(ticket.ticketId);
      },
    },
  );

  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isActionsOpen) return;

    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsActionsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isActionsOpen]);

  if (!currentUser) return null;
  const permissions = getTicketPermissions(ticket, currentUser);

  function handleToggleFavorite(ticketId: number) {
    if (favoriteTickets?.includes(ticketId)) {
      const newFavorite = favoriteTickets.filter((i) => i !== ticketId);
      setFavoriteTickets(newFavorite);
    } else {
      setFavoriteTickets([...(favoriteTickets ?? []), ticketId]);
    }
  }

  const actionRegistry = {
    cancel: {
      Icon: CancelIcon,
      onClick: () => onRequestCancel(ticket.ticketId),
      description: "Отменить",
    },
    edit: {
      Icon: EditIcon,
      onClick: () => onRequestEdit(ticket.ticketId),
      description: "Редактировать",
    },
    repeat: {
      Icon: RepeatIcon,
      onClick: () => onRequestRepeat(ticket.ticketId),
      description: "Повторить",
    },
    favorite: {
      Icon: () => (
        <FavoriteTicketIcon
          ticketId={ticket.ticketId}
          favoriteTickets={favoriteTickets}
        />
      ),
      onClick: () => handleToggleFavorite(ticket.ticketId),
      description: "Избранное",
    },
    telegram: {
      Icon: TelegramIcon,
      onClick: () => console.log("TODO: telegram", ticket.ticketId),
      description: "Телеграм",
    },
  };

  function getStatusIcon(
    status: StatusType,
    layout: "row" | "column",
  ): React.ReactNode {
    const baseStyle =
      layout === "row"
        ? "flex items-center gap-2"
        : "flex flex-col justify-center items-start";

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
            const { Icon, onClick, description } = actionRegistry[key];
            return (
              <CardActionButton
                key={key}
                onClick={onClick}
                text={layout === "column" ? description : null}
                className={`${isDesktop ? "" : "w-full flex items-center gap-2 border-b border-(--text-secondary) py-1"} cursor-pointer outline-0`}
                textClassName={` ${isDesktop ? "" : "text-md text-(--text-secondary) font-normal font-consolas"} `}
              >
                <Icon />
              </CardActionButton>
            );
          })}

        {statusActions[status].includes("telegram") && (
          <CardActionButton
            text={layout === "column" ? "Телеграм" : null}
            className={`${isDesktop ? "" : "w-full flex items-center gap-2 py-1 "} cursor-pointer`}
            textClassName={` ${isDesktop ? "" : "text-md text-(--text-secondary) font-normal font-consolas"} `}
            onClick={actionRegistry.telegram.onClick}
          >
            <TelegramIcon className="text-(--text-tertiary) cursor-pointer" />
          </CardActionButton>
        )}
      </div>
    );
  }

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      ref={cardRef}
      {...(isTouchDevice
        ? bind()
        : { onClick: () => handleOpenView(ticket.ticketId) })}
      className={`relative xl:relative
        w-full px-5 py-3 gap-2 rounded-xs cursor-pointer
        flex flex-col justify-between items-start
      ${ticketView === "my" ? "min-h-41 h-auto xl:min-h-38" : "min-h-41 h-auto xl:min-h-47 "}
      ${shadowLiftCardStyle}
      bg-(--bg-secondary) border border-(--bg-border)
      hover:border-(--text-tertiary)
      xl:relative select-none shrink-0
      -webkit-touch-callout: none
      `}
    >
      {/* Title, dep, employee name and Meta info as manager*/}
      {ticketView === "team" ? (
        <div className="w-full flex flex-col gap-2">
          {/* Строка 1: имя/отдел и ID/дата */}
          {isDesktop ? (
            // Team pc version view
            <div
              className="w-full flex justify-start items-center gap-2
          xl:flex xl:justify-between xl:items-center xl:gap-0"
            >
              <div
                className="flex items-center gap-2 text-(--text-secondary)
            font-jbmono font-medium
            text-[10px] xl:text-xs
            leading-2.5 xl:leading-3"
              >
                {ticket.userName}
                <span>|</span>
                {ticket.department}
              </div>

              <div
                className="w-auto flex items-center font-jbmono text-(--text-secondary)
            font-medium gap-2 select-none
            text-[10px] xl:text-xs
            leading-2.5 xl:leading-3 "
              >
                <span>ID: </span>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(ticket.ticketId.toString());
                  }}
                  className={`flex gap-1.5 hover:text-(--text-primary) ${textPressAnimationStyle}`}
                >
                  {ticket.ticketId}
                </div>
                <span>|</span>
                <div>{ticket.createDate}</div>
              </div>
            </div>
          ) : (
            // Team mobile version view
            <div
              className="w-full flex justify-start items-center gap-2
          xl:flex xl:justify-between xl:items-center xl:gap-0"
            >
              <div
                className="flex items-center gap-2 text-(--text-secondary)
            font-jbmono font-medium
            text-[10px] xl:text-xs
            leading-2.5 xl:leading-3"
              >
                <span>ID: </span>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(ticket.ticketId.toString());
                  }}
                  className={`flex gap-1.5 hover:text-(--text-primary) ${textPressAnimationStyle}`}
                >
                  {ticket.ticketId}
                </div>
                <span>|</span>
                <div>{ticket.createDate}</div>
                <span>|</span>
                {ticket.userName}
                <span>|</span>
                {ticket.department}
              </div>
            </div>
          )}

          {/* Строка 2: заголовок */}
          <div
            className="flex flex-1
          justify-between xl:justify-start
          items-start xl:gap-1.5 min-w-0"
          >
            <div
              className="text-(--text-primary) font-jbmono text-[15px]
            font-bold xl:font-medium
            leading-5 xl:leading-6
            line-clamp-2 xl:line-clamp-1
            select-none cursor-pointer
            xl:truncate"
            >
              {ticket.title}
            </div>
            {ticket.attachedFiles.length > 0 && (
              <AttachIcon className="shrink-0" />
            )}
          </div>
        </div>
      ) : (
        // Title and Meta info as user
        <div
          className="w-full flex
        justify-start xl:justify-between
        items-center xl:py-0.5"
        >
          {isDesktop ? (
            <>
              {/* Personal pc version view  */}
              <div
                className="flex flex-1
          justify-start
          items-center gap-1.5 xl:min-w-0"
              >
                {/* title */}
                <div
                  className="text-(--text-primary) font-jbmono text-[15px]
            font-bold xl:font-medium
            leading-5 xl:leading-6
            select-none cursor-pointer truncate"
                >
                  {ticket.title}
                </div>
                {ticket.attachedFiles.length > 0 && (
                  <AttachIcon className="shrink-0" />
                )}
              </div>
              {/* meta info */}
              <div
                className="w-auto flex items-center font-jbmono text-(--text-secondary)
          text-[10px] xl:text-xs
          leading-2 xl:leading-3
          font-medium
          xl:gap-2
          select-none"
              >
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
            </>
          ) : (
            <div className="w-full flex flex-col items-start gap-3">
              {/* Personal mobile version view */}
              {/* meta info */}
              <div
                className="w-auto flex items-center font-jbmono text-(--text-secondary)
          text-[10px] xl:text-xs
          leading-2 xl:leading-3
          font-medium gap-2 select-none"
              >
                <span>ID: </span>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(ticket.ticketId.toString());
                  }}
                  className={`flex gap-1.5 hover:text-(--text-primary) ${textPressAnimationStyle}`}
                >
                  {ticket.ticketId}
                </div>
                <span>|</span>
                <div>{ticket.createDate}</div>
              </div>

              {/* title */}
              <div
                className="w-full flex flex-1
          justify-between
          items-start gap-1.5 min-w-0"
              >
                <div
                  className="text-(--text-primary) font-jbmono text-[15px]
            font-bold xl:font-medium
            leading-5 xl:leading-6
            line-clamp-2 xl:line-clamp-1
            select-none cursor-pointer
            xl:truncate"
                >
                  {ticket.title}
                </div>
                {ticket.attachedFiles.length > 0 && (
                  <AttachIcon className="shrink-0" />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div
        className="w-full flex-1
        pt-2 mb-1
        text-(--text-secondary) text-sm
        font-consolas font-normal
      leading-4 xl:leading-5
      line-clamp-2 select-none"
      >
        {ticket.description}
      </div>

      {/* Status, priorirty, category, icons */}
      <div
        className="w-full py-2 flex
      justify-start xl:justify-between
      items-center"
      >
        {/* Status, priorirty, category */}
        <div className="flex items-center gap-3 font-jbmono text-xs">
          <div className={getStatusColor(ticket.status)}>
            {getStatusTitle(ticket.status, "singular")}
          </div>
          <div className="h-5 flex justify-center items-center px-2 py-1.5 gap-2.5 bg-(--text-primary) text-(--bg-primary) dark:bg-transparent dark:border dark:border-(--text-tertiary) dark:text-(--text-tertiary) rounded-xs font-bold leading-3 select-none">
            {getPriorityTitle(ticket.priority)}
          </div>
          <div className="h-6 flex justify-center items-center py-1.5 gap-2.5 font-medium leading-3 text-(--text-tertiary) select-none">
            {ticket.breadcrumbs[0]}
          </div>
        </div>

        {isDesktop ? (
          // {/* icons*/}
          <div>{getStatusIcon(ticket.status, "row")}</div>
        ) : (
          <>
            {isActionsOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                className="absolute right-2 top-2 z-10 
              min-w-40
              bg-(--bg-secondary) border border-(--bg-border) rounded-xs p-2 flex flex-col gap-1"
              >
                {getStatusIcon(ticket.status, "column")}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
