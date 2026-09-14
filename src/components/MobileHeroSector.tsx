import { useNavigate } from "react-router";
import useUser from "../hooks/useUser";

import type { StatusType, Ticket, TicketViewType } from "../types/ticket.types";

import mockTicket from "../../mockTicketInfo.json";

import getStatusTitle, { allStatuses } from "../utils/ticketBadgeHelpers";
import getTicketQuantity from "../utils/getTicketQuantity";
import handleStatusSelect from "../utils/statusSelectedHelper";

import TicketCard from "./TicketCard";
import StatusInfoBtn from "./ui/Buttons/StatusInfoBtn";

import MobilePlusIcon from "../icons/mobile/MobilePlusIcon";
import { useState } from "react";

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
}: MobileHeroSectorProps) {
  const navigate = useNavigate();

  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);
  const [revealedTicketId, setRevealedTicketId] = useState<number | null>(null);

  const currentUserId = useUser()?.id;
  const allTickets = mockTicket;

  const ticketStatusOrder = allStatuses;
  const filteredTicketQuantities = allTickets.filter((ticket) => {
    return ticketView === "my"
      ? ticket.userId === currentUserId
      : ticket.userId !== currentUserId;
  });
  const ticketQuantities = getTicketQuantity(
    filteredTicketQuantities as unknown as Ticket[],
  );

  const pillStyle = "flex-1 min-w-19 h-full";

  return (
    <>
      <div
        className="fixed top-15.5
       h-13 w-full
      flex items-center
      overflow-x-hidden scrollbar-none z-20"
      >
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
                {filteredTicketQuantities.length}
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
              onClick={() =>
                handleStatusSelect({
                  item: getStatusTitle(status, "statusBlock"),
                  selectedItems: ticketStatuses,
                  setSelectedItems: setTicketStatuses,
                })
              }
            />
          </div>
        ))}
      </div>

      <div
        className="overflow-y-auto scrollbar-none overflow-x-hidden
      w-full h-full
      pt-30.5 pb-22
      flex flex-1 flex-col justify-start items-center
      gap-2 select-none px-1.5"
      >
        {tickets.map((ticket) => (
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
            expandedTicketId={expandedTicketId}
            setExpandedTicketId={setExpandedTicketId}
            revealedTicketId={revealedTicketId}
            setRevealedTicketId={setRevealedTicketId}
          />
        ))}
        <button
          onClick={() => navigate("/tickets/new/category")}
          className="fixed right-5 bottom-24
        w-15 h-15
        bg-(--bg-btn-primary) rounded-xs
        flex items-center p-5
      cursor-pointer"
        >
          <MobilePlusIcon className="w-full h-full text-[#0C0B0B]" />
        </button>
      </div>
    </>
  );
}

export default MobileHeroSector;
