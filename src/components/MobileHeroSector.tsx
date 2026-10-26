import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import type { ListStateVariant } from "../types/listState.types";
import type { StatusType, Ticket, TicketViewType } from "../types/ticket.types";

import getStatusTitle, {
  allStatuses,
  MOBILE_PILL_LABEL,
} from "../utils/ticketBadgeHelpers";
import getTicketQuantity from "../utils/getTicketQuantity";
import handleStatusSelect from "../utils/statusSelectedHelper";
import { hapticTap } from "../utils/haptics";

import TicketCard from "./TicketCard";
import StatusInfoBtn from "./ui/Buttons/StatusInfoBtn";
import ListStateMessage from "./ui/ListStateMessage";

import MobilePlusIcon from "../icons/mobile/MobilePlusIcon";
import useIsTyping from "../hooks/useIsTyping";
import useMediaQuery from "../hooks/useMediaQuery";

interface MobileHeroSectorProps {
  tickets: Ticket[]; // уже отфильтрованный и отсортированный массив
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;

  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
  ticketView: TicketViewType;

  ticketStatuses: string[];
  setTicketStatuses: (status: string[]) => void;

  handleRequestCancel: (ticketId: number) => void;
  handleRequestRepeat: (ticketId: number) => void;
  handleRequestEdit: (ticketId: number) => void;
  handleOpenView: (ticketId: number) => void;

  listState: ListStateVariant | null;
  onRetry: () => void;

  visibleTickets: Ticket[];
}

function MobileHeroSector({
  tickets,
  favoriteTickets,
  setFavoriteTickets,
  ticketStatuses,
  setTicketStatuses,
  ticketView,
  setTickets,
  handleOpenView,
  handleRequestCancel,
  handleRequestEdit,
  handleRequestRepeat,
  listState,
  onRetry,
  visibleTickets,
}: MobileHeroSectorProps) {
  const navigate = useNavigate();
  const isTyping = useIsTyping();
  const isTouch = useMediaQuery("(pointer: coarse)");
  const hideCreateBtn = isTouch && isTyping;

  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const listScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBlur = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
    };

    if (isDragging) {
      window.addEventListener("blur", handleBlur);
    }
    return () => {
      window.removeEventListener("blur", handleBlur);
    };
  }, [isDragging]);

  function handlePointerDown(e: React.PointerEvent) {
    if (!containerRef.current) return;
    if (e.pointerType !== "mouse") return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    startScrollLeftRef.current = containerRef.current.scrollLeft;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!containerRef.current) return;
    if (!isDraggingRef.current || e.pointerType !== "mouse") return;

    const deltaX = e.clientX - startXRef.current;

    if (Math.abs(deltaX) > 5 && !hasDraggedRef.current) {
      hasDraggedRef.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    containerRef.current.scrollLeft = startScrollLeftRef.current - deltaX;
  }

  function handlePointerUp(e: React.PointerEvent) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    isDraggingRef.current = false;
  }

  function handleClickCapture(e: React.MouseEvent) {
    if (hasDraggedRef.current) {
      e.stopPropagation();
    }
  }

  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);
  const [revealedTicketId, setRevealedTicketId] = useState<number | null>(null);

  const ticketStatusOrder = allStatuses;

  const ticketQuantities = getTicketQuantity(visibleTickets);

  const pillStyle = "flex-1 min-w-28 h-full";

  return (
    <>
      <div
        onClickCapture={handleClickCapture}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        ref={containerRef}
        className={`
       h-13 w-full
      flex items-center
      overflow-x-auto scrollbar-none z-20
      ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {/* NOTE: [&_*]:pointer-events-none - condition to show grab cursor. Use it in style above */}
        {/* Status row */}
        <div className={pillStyle}>
          <div
            onClick={() =>
              handleStatusSelect({
                item: "Все",
                selectedItems: ticketStatuses,
                setSelectedItems: setTicketStatuses,
              })
            }
            className={`h-full ${
              ticketStatuses.includes("Все")
                ? "border-(--bg-border)"
                : "border-(--bg-border) hover:border-(--border-hover-btn)"
            } bg-(--bg-primary-second) border xl:rounded-xs group`}
          >
            <div className="flex flex-col items-center justify-center h-full gap-1 select-none cursor-pointer">
              {/* Quantity */}
              <div
                className={`font-jbmono text-sm font-normal leading-5 ${
                  ticketStatuses.includes("Все")
                    ? "text-(--text-primary)"
                    : "text-(--text-primary)"
                } group-hover:text-(--text-primary)`}
              >
                {visibleTickets.length}
              </div>
              {/* Label */}
              <div
                className={`text-sm font-consolas font-normal leading-3 ${
                  ticketStatuses.includes("Все")
                    ? "text-(--bg-btn-primary)"
                    : "text-(--text-secondary)"
                } group-hover:text-(--text-primary)`}
              >
                Все
              </div>
            </div>
          </div>
        </div>
        {ticketStatusOrder.map((status) => (
          <div className={pillStyle} key={status}>
            <StatusInfoBtn
              quantity={ticketQuantities[status]}
              status={status as StatusType}
              plateHeight="h-full"
              selectedItems={ticketStatuses}
              onClick={() => {
                handleStatusSelect({
                  item: getStatusTitle(status, "statusBlock"),
                  selectedItems: ticketStatuses,
                  setSelectedItems: setTicketStatuses,
                });
              }}
              label={MOBILE_PILL_LABEL[status]}
            />
          </div>
        ))}
      </div>

      <div
        ref={listScrollRef}
        className="overflow-y-auto scrollbar-none overflow-x-none
      w-full h-full

      flex flex-1 flex-col justify-start items-center
      gap-2 select-none px-2 py-2"
      >
        {listState !== null ? (
          <ListStateMessage variant={listState} onRetry={onRetry} />
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
              favoriteTickets={favoriteTickets}
              setFavoriteTickets={setFavoriteTickets}
              ticketView={ticketView}
              setTickets={setTickets}
              onRequestCancel={handleRequestCancel}
              onRequestRepeat={handleRequestRepeat}
              onRequestEdit={handleRequestEdit}
              handleOpenView={handleOpenView}
              swipe={{
                expandedTicketId,
                setExpandedTicketId,
                revealedTicketId,
                setRevealedTicketId,
                scrollContainerRef: listScrollRef,
              }}
            />
          ))
        )}
        {!hideCreateBtn && (
          <button
            onClick={() => {
              hapticTap();
              navigate("/tickets/new/category");
            }}
            className="fixed right-5 bottom-24
          w-15 h-15
          bg-(--bg-btn-primary) rounded-xs
          flex items-center p-5
          cursor-pointer"
          >
            <MobilePlusIcon className="w-full h-full text-[#0C0B0B]" />
          </button>
        )}
      </div>
    </>
  );
}

export default MobileHeroSector;
