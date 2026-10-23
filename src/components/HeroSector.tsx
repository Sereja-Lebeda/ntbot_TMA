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

import getStatusTitle, {
  getStatusRank,
  STATUS_ORDER_BY_STATUS,
  STATUS_ORDER_DEFAULT,
} from "../utils/ticketBadgeHelpers";
import { allActions } from "../utils/allActions";
import getListStateVariant from "../utils/getListStateVariant";
import TicketUnavailableModal from "./pages/modalCardWindows/TicketUnavailableModal";

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
    action: Action | undefined,
  ) => Promise<boolean>;
  handleEditSubmit: (
    data: {
      formData: Record<string, string>;
      multiData: Record<string, string[]>;
      priority: PriorityLevel;

      attachedFiles: TicketAttachmentType;
    },
    ticket: Ticket | undefined,
  ) => Promise<boolean>;

  handleOpenView: (ticketId: number) => void;

  isLoading: boolean;
  error: Error | null;
  reload: () => void;

  visibleTickets: Ticket[];
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
  const { isLoading: isUserLoading, error: userError } = useUser();
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
    isLoading: isTicketsLoading,
    error: ticketsError,
    reload,
    visibleTickets,
  } = useOutletContext<OutletContextProps>();

  const isLoading = isUserLoading || isTicketsLoading;
  const error = ticketsError ?? userError;

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

  const { ticket: editedTicket, action: editedAction } = useTicketAndAction({
    ticketId: activeModal?.type === "edit" ? activeModal.ticketId : undefined,
    tickets,
    allActions,
  });

  const navigate = useNavigate();

  const order =
    sortByStatus === "default" ? STATUS_ORDER_DEFAULT : STATUS_ORDER_BY_STATUS;

  const filteredTickets = visibleTickets
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
    .sort((a, b) => {
      const rankDiff =
        getStatusRank(a.status, order) - getStatusRank(b.status, order);
      if (rankDiff !== 0) {
        return sortByStatus === "complete" ? -rankDiff : rankDiff;
      }
      return sortOldToNew
        ? a.createStamp - b.createStamp
        : b.createStamp - a.createStamp;
    });

  const listState = getListStateVariant({
    isLoading,
    error,
    ticketQuantity: visibleTickets.length,
    filteredTicketQuantity: filteredTickets.length,
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
      {activeModal?.type === "view" &&
        (viewedTicket && viewedAction ? (
          <ViewTicketModal
            ticket={viewedTicket}
            action={viewedAction}
            onClose={() => {
              setActiveModal(null);
            }}
            favoriteTickets={favoriteTickets}
            setFavoriteTickets={setFavoriteTickets}
            onCancel={() => {
              setActiveModal({
                type: "cancel",
                ticketId: viewedTicket.ticketId,
                from: "view",
              });
            }}
            onRepeat={() => {
              setActiveModal({
                type: "repeat",
                ticketId: viewedTicket.ticketId,
                from: "view",
              });
            }}
            onEdit={() => {
              setActiveModal({
                type: "edit",
                ticketId: viewedTicket.ticketId,
                from: "view",
              });
            }}
            onChangeStatus={handleStatusChange}
          />
        ) : (
          <TicketUnavailableModal onClose={() => setActiveModal(null)} />
        ))}
      {activeModal?.type === "repeat" &&
        (repeatTicket && repeatAction ? (
          <EditRepeatModal
            ticket={repeatTicket}
            action={repeatAction}
            onClose={handleRepeatCancel}
            onSubmit={async (data) => {
              await handleRepeatSubmit(data, repeatAction);
            }}
            mode="repeat"
            favoriteTickets={favoriteTickets}
            setFavoriteTickets={setFavoriteTickets}
          />
        ) : (
          <TicketUnavailableModal onClose={() => setActiveModal(null)} />
        ))}

      {activeModal?.type === "edit" &&
        (editedTicket && editedAction ? (
          <EditRepeatModal
            ticket={editedTicket}
            action={editedAction}
            onClose={handleEditCancel}
            onSubmit={async (data) => {
              await handleEditSubmit(data, editedTicket);
            }}
            mode="edit"
            favoriteTickets={favoriteTickets}
            setFavoriteTickets={setFavoriteTickets}
          />
        ) : (
          <TicketUnavailableModal onClose={() => setActiveModal(null)} />
        ))}

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
          listState={listState}
          onRetry={reload}
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
          listState={listState}
          onRetry={reload}
          visibleTickets={visibleTickets}
        />
      )}
    </div>
  );
}
