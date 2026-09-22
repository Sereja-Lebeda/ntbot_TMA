import { useNavigate, useOutletContext } from "react-router";
import React from "react";
import useUser from "../hooks/useUser";
import useSearch from "../hooks/useSearch";
import useMediaQuery from "../hooks/useMediaQuery";
import useTicketAndAction from "../hooks/useTicketAndAction";

import type {
  Ticket,
  TicketViewType,
  TicketAttachmentType,
  StatusType,
} from "../types/ticket.types";
import type { PriorityLevel, Action } from "../types/createTicket.type";
import type { ModalTypes } from "../types/modalTypes";

import ViewTicketModal from "./pages/modalCardWindows/ViewTicketModal";
import EditRepeatModal from "./pages/modalCardWindows/EditRepeatModal";

import DesktopHeroSector from "./DesktopHeroSector";
import MobileHeroSector from "./MobileHeroSector";

import getStatusTitle from "../utils/ticketBadgeHelpers";
import { allActions } from "../utils/allActions";

interface selectedTicketStatusesProps {
  className?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;

  ticketStatuses: string[];
  setTicketStatuses: (status: string[]) => void;
  ticketCategories: string[];
  ticketDepartments: string[];
  ticketEmployees: string[];
  setOpenDropdownFilter: (filter: string | null) => void;
  hasActiveFilters: boolean | undefined;

  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;

  isPrivilegeUser: boolean;
  ticketView: TicketViewType;
  setTicketView: React.Dispatch<React.SetStateAction<TicketViewType>>;
  resetFilters: () => void;

  sortOldToNew: boolean;
  setSortOldToNew: (sortByTime: boolean) => void;
  sortByStatus: string;
  changePrioritySort: () => void;
}

interface OutletContextProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;

  activeModal: ModalTypes;
  setActiveModal: React.Dispatch<React.SetStateAction<ModalTypes>>;

  handleStatusChange: (ticketId: number, status: StatusType) => void;
  handleRepeatCancel: () => void;
  handleEditCancel: () => void;

  handleRequestCancel: (ticketId: number) => void;
  handleRequestEdit: (ticketId: number) => void;
  handleRequestRepeat: (ticketId: number) => void;

  handleRepeatSubmit: (
    data: {
      formData: Record<string, string>;
      multiData: Record<string, string[]>;
      priority: PriorityLevel;
      attachedFiles: TicketAttachmentType;
    },
    ticket: Ticket | undefined,
    action: Action | undefined,
  ) => void;
  handleEditSubmit: (
    data: {
      formData: Record<string, string>;
      multiData: Record<string, string[]>;
      priority: PriorityLevel;
      action: Action;
      attachedFiles: TicketAttachmentType;
      status: StatusType;
    },
    ticket: Ticket | undefined,
  ) => void;

  handleOpenView: (ticketId: number) => void;
}

export default function HeroSector({
  ticketStatuses,
  setTicketStatuses,
  ticketCategories,
  ticketDepartments,
  ticketEmployees,
  resetFilters,
  setOpenDropdownFilter,
  favoriteTickets,
  setFavoriteTickets,
  showFavorites,
  setShowFavorites,
  isPrivilegeUser,
  ticketView,
  setTicketView,
  sortOldToNew,
  setSortOldToNew,
  sortByStatus,
  className,
  inputRef,
  changePrioritySort,
  hasActiveFilters,
}: selectedTicketStatusesProps) {
  const currentUser = useUser();
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const {
    tickets,
    setTickets,
    activeModal,
    setActiveModal,
    handleRequestCancel,
    handleRequestEdit,
    handleRequestRepeat,
    handleOpenView,
    handleStatusChange,
    handleRepeatCancel,
    handleEditCancel,
    handleRepeatSubmit,
    handleEditSubmit,
  } = useOutletContext<OutletContextProps>();

  const { searchRequest, setSearchRequest } = useSearch();

  const { ticket: viewedTicket, action: viewedAction } = useTicketAndAction({
    ticketId: activeModal?.type === "view" ? activeModal.ticketId : undefined,
    tickets,
    allActions,
  });

  const { ticket: repeatTicket, action: repeatAction } = useTicketAndAction({
    ticketId: activeModal?.type === "repeat" ? activeModal.ticketId : undefined,
    tickets,
    allActions,
  });

  const { ticket: editTicket, action: editAction } = useTicketAndAction({
    ticketId: activeModal?.type === "edit" ? activeModal.ticketId : undefined,
    tickets,
    allActions,
  });

  const navigate = useNavigate();

  if (!currentUser) return null;

  const statusPriority = {
    New: 0,
    "In progress": 1,
    Paused: 2,
    Closed: 3,
    Cancelled: 4,
    Complete: 5,
  };

  const filteredTickets = tickets
    // Filter by Searchbar
    .filter((ticket) => ticketMatchesSearch(ticket, searchRequest))
    // Filter by filter side layout
    .filter(
      (ticket) =>
        (ticketStatuses.includes("Все") ||
          ticketStatuses.includes(
            getStatusTitle(ticket.status, "statusBlock"),
          )) &&
        (ticketCategories.includes("Все") ||
          ticketCategories.includes(ticket.breadcrumbs[0])) &&
        (ticketView !== "team" ||
          ticketDepartments.includes("Все") ||
          ticketDepartments.includes(ticket.department ?? "")) &&
        (ticketView !== "team" ||
          ticketEmployees.includes("Все") ||
          ticketEmployees.includes(ticket.userName ?? "")),
    )
    // Filter by favorite tickets
    .filter(
      (ticket) => !showFavorites || favoriteTickets.includes(ticket.ticketId),
    )
    // Filter tickets by role
    .filter((ticket) => {
      if (currentUser.role === "admin" && ticketView === "team") {
        return true;
      }
      if (currentUser.role === "manager" && ticketView === "team") {
        return ticket.department === currentUser.department;
      }
      return ticket.userId === currentUser.id;
    })
    .sort((a, b) =>
      sortOldToNew
        ? Date.parse(a.createDate.split(".").reverse().join("-")) -
          Date.parse(b.createDate.split(".").reverse().join("-"))
        : Date.parse(b.createDate.split(".").reverse().join("-")) -
          Date.parse(a.createDate.split(".").reverse().join("-")),
    )
    .sort((a, b) => {
      if (sortByStatus === "default") return 0;
      if (sortByStatus === "new") {
        return statusPriority[a.status] - statusPriority[b.status];
      }

      if (sortByStatus === "complete") {
        return statusPriority[b.status] - statusPriority[a.status];
      }
      return 0;
    });

  function ticketMatchesSearch(ticket: Ticket, query: string): boolean {
    return [
      ticket.title,
      ticket.description,
      ticket.createDate,
      ticket.ticketId.toString(),
      ticket.breadcrumbs[0],
    ].some((value) => value?.toLowerCase().includes(query.toLowerCase()));
  }

  return (
    <div
      className={`h-full xl:relative xl:flex-1 xl:max-w-225 xl:min-w-130 xl:h-full flex flex-col xl:items-center xl:rounded-xs xl:border xl:border-(--bg-border) xl:bg-(--bg-primary-second) xl:mx-3 xl:p-5 ${className} `}
    >
      {activeModal?.type === "view" && (
        <ViewTicketModal
          ticket={viewedTicket}
          action={viewedAction}
          onClose={() => {
            setActiveModal(null);
          }}
          favoriteTickets={favoriteTickets}
          setFavoriteTickets={setFavoriteTickets}
          onCancel={() => {
            if (viewedTicket) {
              setActiveModal({
                type: "cancel",
                ticketId: viewedTicket.ticketId,
                from: "view",
              });
            }
          }}
          onRepeat={() => {
            if (viewedTicket) {
              setActiveModal({
                type: "repeat",
                ticketId: viewedTicket.ticketId,
                from: "view",
              });
            }
          }}
          onEdit={() => {
            if (viewedTicket) {
              setActiveModal({
                type: "edit",
                ticketId: viewedTicket.ticketId,
                from: "view",
              });
            }
          }}
          onChangeStatus={handleStatusChange}
        />
      )}
      {activeModal?.type === "repeat" && (
        <EditRepeatModal
          ticket={repeatTicket}
          action={repeatAction}
          onClose={handleRepeatCancel}
          onSubmit={(data) =>
            handleRepeatSubmit(data, repeatTicket, repeatAction)
          }
          mode="repeat"
          favoriteTickets={favoriteTickets}
          setFavoriteTickets={setFavoriteTickets}
        />
      )}

      {activeModal?.type === "edit" && (
        <EditRepeatModal
          ticket={editTicket}
          action={editAction}
          onClose={handleEditCancel}
          onSubmit={(data) => handleEditSubmit(data, editTicket)}
          mode="edit"
          favoriteTickets={favoriteTickets}
          setFavoriteTickets={setFavoriteTickets}
        />
      )}

      {isDesktop ? (
        <DesktopHeroSector
          tickets={filteredTickets}
          setTickets={setTickets}
          inputRef={inputRef}
          searchRequest={searchRequest}
          setSearchRequest={setSearchRequest}
          favoriteTickets={favoriteTickets}
          setFavoriteTickets={setFavoriteTickets}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          ticketView={ticketView}
          setTicketView={setTicketView}
          sortOldToNew={sortOldToNew}
          setSortOldToNew={setSortOldToNew}
          sortByStatus={sortByStatus}
          setOpenDropdownFilter={setOpenDropdownFilter}
          changePrioritySort={changePrioritySort}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          isPrivilegeUser={isPrivilegeUser}
          handleOpenView={handleOpenView}
          handleRequestCancel={handleRequestCancel}
          handleRequestEdit={handleRequestEdit}
          handleRequestRepeat={handleRequestRepeat}
        />
      ) : (
        <MobileHeroSector
          ticketStatuses={ticketStatuses}
          setTicketStatuses={setTicketStatuses}
          tickets={filteredTickets}
          favoriteTickets={favoriteTickets}
          setFavoriteTickets={setFavoriteTickets}
          ticketView={ticketView}
          setTickets={setTickets}
          handleOpenView={(ticketId: number) => {
            navigate(`/tickets/${ticketId}`);
          }}
          handleRequestCancel={handleRequestCancel}
          handleRequestEdit={(ticketId: number) => {
            navigate(`/tickets/${ticketId}/edit`);
          }}
          handleRequestRepeat={(ticketId: number) => {
            navigate(`/tickets/${ticketId}/repeat`);
          }}
        />
      )}
    </div>
  );
}
