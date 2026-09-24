import { useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import useMediaQuery from "../hooks/useMediaQuery";

import { useLongPress, LongPressEventType } from "use-long-press";

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
  expandedTicketId: number | null;
  setExpandedTicketId: (ticketId: number | null) => void;
  revealedTicketId: number | null;
  setRevealedTicketId: (ticketId: number | null) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
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
  expandedTicketId,
  setExpandedTicketId,
  revealedTicketId,
  setRevealedTicketId,
  scrollContainerRef,
}: TicketCardWithActionsProps) {
  const currentUser = useUser();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isTouchDevice = useMediaQuery("(pointer: coarse)");

  // Long press for dropdown in mobile ver
  const bind = useLongPress(
    () => {
      setExpandedTicketId(ticket.ticketId); // сработает через `threshold` мс удержания
    },
    {
      threshold: 500, // сколько мс считать долгим нажатием
      cancelOnMovement: 15, // если палец сдвинулся больше 15px — это свайп, не долгое нажатие; отменяем
      detect: LongPressEventType.Pointer,
      onCancel: (event, meta) => {
        // сработает, если отпустили РАНЬШЕ threshold — то есть это был короткий тап
        if (meta.reason === "cancelled-by-release")
          handleOpenView(ticket.ticketId);
      },
    },
  );

  // Left swipe hooks for ticket
  const [swipeX, setSwipeX] = useState(0);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const directionRef = useRef<"horizontal" | "vertical" | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const startScrollTopRef = useRef(0);

  const permissions = currentUser
    ? getTicketPermissions(ticket, currentUser)
    : null;

  useEffect(() => {
    if (revealedTicketId !== ticket.ticketId && swipeX !== 0) {
      setSwipeX(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealedTicketId]);

  useEffect(() => {
    if (revealedTicketId !== ticket.ticketId) return;

    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setRevealedTicketId(null);
        setSwipeX(0);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealedTicketId, ticket.ticketId]);

  useEffect(() => {
    if (!permissions?.canCancel && swipeX !== 0) {
      setSwipeX(0);
      if (revealedTicketId === ticket.ticketId) {
        setRevealedTicketId(null);
      }
      directionRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions?.canCancel, ticket.ticketId]);

  useEffect(() => {
    if (expandedTicketId !== ticket.ticketId || ticket.status === "Complete")
      return;

    function handleClickOutsideExpand(e: MouseEvent | TouchEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setExpandedTicketId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutsideExpand);
    document.addEventListener("touchstart", handleClickOutsideExpand);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideExpand);
      document.removeEventListener("touchstart", handleClickOutsideExpand);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedTicketId, ticket.ticketId, ticket.status]);

  const iconsRowRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const isExpanded =
    expandedTicketId === ticket.ticketId || ticket.status === "Complete";

  useEffect(() => {
    if (iconsRowRef.current) {
      setContentHeight(iconsRowRef.current.offsetHeight);
    }
  }, [isExpanded, ticket.status]);

  //Ctx menu for narrow pc screen
  const menuVisible = expandedTicketId === ticket.ticketId;
  // console.log("menuVisible:", menuVisible, "ticketId:", ticket.ticketId);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  // const menuRef = useRef<HTMLDivElement | null>(null);
  const cardWidthRef = useRef(0);

  const handleContextMenuPC = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // console.log("context menu triggered for:", ticket.ticketId);

    const menuWidth = 200; // подставь реальную ширину меню
    const menuHeight = 150; // подставь реальную высоту меню

    let x = e.clientX;
    let y = e.clientY;

    // Коррекция, чтобы не вылезало за правый край
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth;
    }

    // Коррекция, чтобы не вылезало за нижний край
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight;
    }

    setMenuPosition({ x, y });
    setExpandedTicketId(ticket.ticketId);
  };

  const handleOutsideClickPC = (e: MouseEvent) => {
    // console.log("outside click");
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      setExpandedTicketId(null);
    }
  };

  useEffect(() => {
    if (!menuVisible) return;
    // console.log("effect subscribed for ticket:", ticket.ticketId);
    document.addEventListener("click", handleOutsideClickPC);
    return () => document.removeEventListener("click", handleOutsideClickPC);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuVisible]);

  if (!currentUser) return null;

  const activateThreshold = -105;

  function handleToggleFavorite(ticketId: number) {
    if (favoriteTickets?.includes(ticketId)) {
      const newFavorite = favoriteTickets.filter((i) => i !== ticketId);
      setFavoriteTickets(newFavorite);
    } else {
      setFavoriteTickets([...(favoriteTickets ?? []), ticketId]);
    }
  }

  const revealThreshold = -20; // px — минимальное движение, чтобы что-то засчиталось
  const cancelThreshold = -180;
  const maxSwipe = -320; // px — предел, за которым сразу активируется отмена

  const revealMag = Math.abs(revealThreshold); // 20
  const activateMag = Math.abs(activateThreshold); // 105
  const cancelMag = Math.abs(cancelThreshold); // 180

  // Появление — от revealThreshold (0) до activateThreshold (1)
  const appearProgress = Math.min(
    Math.max((Math.abs(swipeX) - revealMag) / (activateMag - revealMag), 0),
    1,
  );

  // Исчезновение — от activateThreshold (0) до cancelThreshold (1)
  const fadeProgress = Math.min(
    Math.max((Math.abs(swipeX) - activateMag) / (cancelMag - activateMag), 0),
    1,
  );

  const textOpacity = Math.min(appearProgress, 1 - fadeProgress);

  function handlePointerDown(e: React.PointerEvent) {
    // if (!permissions?.canCancel) return;
    if (!scrollContainerRef.current) return;

    startScrollTopRef.current = scrollContainerRef.current.scrollTop;

    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    cardWidthRef.current = cardRef.current?.offsetWidth ?? 0;

    // Если это ДРУГАЯ карточка — сбрасываем её на 0, эта не должна была быть зафиксирована
    if (ticket.ticketId !== revealedTicketId) {
      setRevealedTicketId(null);
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    // if (!permissions?.canCancel) return;

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;
    const horizontalBias = 3; // во сколько раз X "весомее" Y при определении направления

    if (directionRef.current === null) {
      const threshold = 10; // amount of px's before decide what action should be
      if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
        return;
      }
      if (Math.abs(deltaX) * horizontalBias > Math.abs(deltaY)) {
        directionRef.current = "horizontal";
      } else {
        directionRef.current = "vertical";
      }
    }

    if (directionRef.current === "horizontal" && permissions?.canCancel) {
      // Базовая позиция — либо 0 (обычный случай), либо уже зафиксированное значение (если карточка была revealed)
      const basePosition =
        revealedTicketId === ticket.ticketId ? activateThreshold : 0;
      setSwipeX(Math.min(0, Math.max(basePosition + deltaX, maxSwipe)));
    }

    if (directionRef.current === "vertical" && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = startScrollTopRef.current - deltaY;
    }
  }

  function handlePointerUp() {
    if (swipeX > revealThreshold) {
      setSwipeX(0);
    } else if (swipeX > cancelThreshold) {
      setRevealedTicketId(ticket.ticketId);
      setSwipeX(activateThreshold);
    } else {
      if (permissions?.canCancel) {
        onRequestCancel(ticket.ticketId);
      }
      setSwipeX(0);
    }
    directionRef.current = null;
  }

  const longPressBind = isTouchDevice
    ? bind()
    : ({} as ReturnType<typeof bind>);

  function combinedPointerDown(e: React.PointerEvent) {
    longPressBind.onPointerDown?.(e);
    if (isTouchDevice) handlePointerDown(e);
  }

  function combinedPointerMove(e: React.PointerEvent) {
    longPressBind.onPointerMove?.(e);
    if (isTouchDevice) handlePointerMove(e);
  }

  function combinedPointerUp(e: React.PointerEvent) {
    longPressBind.onPointerUp?.(e);
    if (isTouchDevice) handlePointerUp();
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
      Icon: ({ className }: { className?: string }) => (
        <FavoriteTicketIcon
          ticketId={ticket.ticketId}
          favoriteTickets={favoriteTickets}
          className={className}
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

  const keysToShow =
    currentUser.role === "admin"
      ? Object.keys(actionRegistry)
      : statusActions[ticket.status];

  function getStatusIcon(
    status: StatusType,

    ctxMenu?: boolean,
  ): React.ReactNode {
    const baseStyle = "flex items-center gap-2";

    //todo: make auto "yes" answer after 48h if user didn't choose
    if (status === "Complete") {
      return (
        <div
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          className={`flex items-center gap-2 font-jbmono
        ${!isDesktop ? "justify-center" : ""}`}
        >
          <span className="text-(--text-primary) text-xs font-medium leading-3 select-none">
            Заявка выполнена?
          </span>
          <div className={`${baseStyle} `}>
            <button
              className="h-6 bg-(--bg-task-complete) dark:bg-(--bg-btn-primary) flex items-center px-1.5 py-0.5 gap-1 rounded-xs select-none cursor-pointer hover:bg-(--text-primary) group"
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
              <CheckIcon className="text-(--text-primary) group-hover:text-(--bg-primary) dark:text-(--bg-primary)" />
              <span className="font-bold leading-3 text-xs text-(--text-primary) group-hover:text-(--bg-primary) dark:text-(--bg-primary)">
                Да
              </span>
            </button>
            <button
              className="h-6 bg-(--bg-task-cancelled) dark:bg-(--bg-task-cancelled) flex items-center px-1.5 py-0.5 gap-1 rounded-xs select-none cursor-pointer hover:bg-(--text-primary) group"
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
              <CrossIcon className="w-2.5 h-2.5 text-(--text-primary) group-hover:text-(--bg-primary) dark:text-(--bg-primary)" />
              <span className="font-bold leading-3 text-xs text-(--text-primary) group-hover:text-(--bg-primary) dark:text-(--bg-primary)">
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
              return permissions?.canCancel;
            }
            if (key === "edit") {
              return permissions?.canEdit;
            }

            return true;
          })
          .map((key) => {
            const { Icon, onClick } = actionRegistry[key];
            return (
              <CardActionButton
                key={key}
                onClick={onClick}
                className={`${isDesktop ? "" : "w-full flex items-center gap-2 border-b border-(--text-secondary) py-1 px-2 "} cursor-pointer outline-0
                ${ctxMenu ? "bg-(--bg-primary) hover:bg-(--border-hover-btn)" : ""}
                group`}
                textClassName={` ${isDesktop ? "" : "text-md text-(--text-secondary) font-normal font-consolas"} 
                ${textPressAnimationStyle}
                group-hover:text-(--text-primary)`}
              >
                <Icon className="group-hover:text-(--text-primary) duration-600 ease-in-out" />
              </CardActionButton>
            );
          })}

        {statusActions[status].includes("telegram") && (
          <CardActionButton
            className={`${isDesktop ? "" : "w-full flex items-center gap-2 py-1 px-2"} cursor-pointer group
            ${ctxMenu ? "bg-(--bg-primary) hover:bg-(--border-hover-btn)" : ""}`}
            textClassName={` ${isDesktop ? "" : "text-md text-(--text-secondary) font-normal font-consolas"} 
            ${textPressAnimationStyle}
            group-hover:text-(--text-primary)`}
            onClick={actionRegistry.telegram.onClick}
          >
            <TelegramIcon className="text-(--text-tertiary) cursor-pointer group-hover:text-(--text-primary) duration-600 ease-in-out" />
          </CardActionButton>
        )}
      </div>
    );
  }

  return (
    <div ref={cardRef} className="relative w-full">
      {swipeX < 0 && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-center"
          style={{ width: Math.abs(swipeX) }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!permissions?.canCancel) return;
              onRequestCancel(ticket.ticketId);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            className="h-full flex flex-col justify-center items-center gap-2"
          >
            <CancelIcon
              style={{
                opacity: appearProgress,
                transform: `scale(${1 + fadeProgress * 0.5})`,
              }}
              className="w-14 h-14 text-[#0c0b0b] dark:text-(--text-primary)"
            />
            <div
              style={{
                opacity: textOpacity,
                maxHeight: textOpacity * 40, // 40 — примерная исходная высота текстового блока в px, подбери по факту
                overflow: "hidden",
              }}
              className="flex flex-col items-center leading-none"
            >
              <span className="h-7 leading-4 font-consolas font-bold flex items-center text-xl text-(--text-primary) pt-1">
                Отменить
              </span>
            </div>
          </button>
        </div>
      )}

      <div
        onContextMenu={
          isTouchDevice
            ? (e) => {
                e.preventDefault();
              }
            : handleContextMenuPC
        }
        {...(isTouchDevice
          ? longPressBind
          : { onClick: () => handleOpenView(ticket.ticketId) })}
        onPointerDown={isTouchDevice ? combinedPointerDown : undefined}
        onPointerMove={isTouchDevice ? combinedPointerMove : undefined}
        onPointerUp={isTouchDevice ? combinedPointerUp : undefined}
        className={`relative xl:relative
          w-full px-5 py-3 gap-2 rounded-xs cursor-pointer
          flex flex-col justify-between items-start
          ${ticketView === "my" ? "min-h-41 h-auto xl:min-h-38" : "min-h-41 h-auto xl:min-h-47 "}
          ${shadowLiftCardStyle}
          bg-(--bg-secondary) border border-(--bg-border)
          hover:border-(--text-tertiary)
          xl:relative select-none shrink-0
          -webkit-touch-callout: none
touch-none
          ${!isDesktop && isExpanded ? "-translate-y-1 border-(--text-primary) shadow-[0_4px_0_0_var(--text-tertiary)]" : ""}
          `}
        style={
          isTouchDevice
            ? {
                transform: `translateX(${swipeX}px)`,
                transition: directionRef.current
                  ? "none"
                  : "transform 200ms ease-out",
              }
            : undefined
        }
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
                <AttachIcon className="shrink-0 text-(--text-primary)" />
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
                    <AttachIcon className="shrink-0 text-(--text-primary)" />
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
                    <AttachIcon className="shrink-0 text-(--text-primary)" />
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

        {/* Status, priority, category, icons */}
        <div
          className="w-full py-2 flex
        justify-start xl:justify-between
        items-center"
        >
          {/* Status, priority, category */}
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
            <div>{getStatusIcon(ticket.status)}</div>
          ) : (
            <>
              {menuVisible && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  style={{
                    top: `${menuPosition.y}px`,
                    left: `${menuPosition.x}px`,
                  }}
                  className="pc-ctx-menu
                fixed
                border border-(--bg-border)
                z-30"
                >
                  {(getStatusIcon(ticket.status), true)}
                </div>
              )}
            </>
          )}
        </div>
        {!isDesktop && (
          <div
            className={`w-full overflow-hidden transition-all duration-300
            `}
            style={{
              maxHeight: isExpanded ? contentHeight : 0,
              marginTop: isExpanded ? 0 : -8,
            }}
          >
            <div onClick={(e) => e.stopPropagation()} ref={iconsRowRef}>
              {ticket.status === "Complete" ? (
                getStatusIcon(ticket.status)
              ) : (
                <div
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  className="w-full flex justify-evenly items-center gap-2 cursor-default"
                >
                  {keysToShow
                    .filter((key) => key !== "telegram")
                    .filter((key) => {
                      if (key === "cancel") return permissions?.canCancel;
                      if (key === "edit") return permissions?.canEdit;
                      return true;
                    })
                    .map((key) => {
                      const { Icon, onClick } =
                        actionRegistry[key as keyof typeof actionRegistry];
                      return (
                        <CardActionButton
                          key={key}
                          onClick={onClick}
                          className="cursor-pointer outline-0 group"
                          textClassName={`text-md text-(--text-secondary) font-normal font-consolas ${textPressAnimationStyle} group-hover:text-(--text-primary)`}
                        >
                          <Icon className="group-hover:text-(--text-primary) duration-600 ease-in-out w-7 h-7" />
                        </CardActionButton>
                      );
                    })}
                  {keysToShow.includes("telegram") && (
                    <CardActionButton
                      onClick={actionRegistry.telegram.onClick}
                      className="cursor-pointer outline-0 group p-2"
                      textClassName={`group-hover:text-(--text-primary)`}
                    >
                      <TelegramIcon className="w-7 h-7 text-(--text-tertiary) group-hover:text-(--text-primary) duration-600 ease-in-out" />
                    </CardActionButton>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
