import { useState } from "react";

import type {
  Ticket,
  SortByStatusType,
  TicketViewType,
} from "../types/ticket.types";

import type { UserType } from "../types/user.types";
import type { CategoryNode, PriorityLevel } from "../types/createTicket.type";

import TicketCard from "./TicketCard";
import Searchbar from "./ui/Searchbar";
import SearchMenuBtn from "./ui/Buttons/SearchMenuBtn";
import ConfirmModal from "./pages/modalCardWindows/ConfirmModal";
import ViewTicketModal from "./pages/modalCardWindows/ViewTicketModal";

import getStatusTitle from "../utils/ticketBadgeHelpers";
import mockUser from "../../mockUserInfo.json";
import mockActionsNested from "../../mockActionsNested.json";

import { hoverAnimationStyle } from "../styles/pressAnimation";

import ManagerIcon from "../icons/searchmenu/ManagerIcon";
import DeleteFilterIcon from "../icons/searchmenu/DeleteFilterIcon";
import FavoriteFilterBtn from "../icons/searchmenu/FavoriteFilterBtn";
import PrioritySortIcon from "../icons/searchmenu/PrioritySortIcon";
import PriorityNewSortIcon from "../icons/searchmenu/PriorityNewSortIcon";
import PriorityCompleteSortIcon from "../icons/searchmenu/PriorityCompleteSortIcon";
import TimeSortIcon from "../icons/searchmenu/TimeSortIcon";
import TimeSortActiveIcon from "../icons/searchmenu/TimeSortActiveIcon";
import UserIcon from "../icons/searchmenu/UserIcon";
import flattenActions from "../utils/flattenActions";
import getTicketDescription from "../utils/getTicketDescription";
import EditRepeatModal from "./pages/modalCardWindows/EditRepeatModal";

interface selectedTicketStatusesProps {
  className?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  setSearchQuery: (req: string) => void;

  ticketStatuses: string[];
  ticketCategories: string[];
  ticketDepartments: string[];
  ticketEmployees: string[];
  setOpenDropdownFilter: (filter: string | null) => void;

  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;

  isManager: boolean;
  ticketView: TicketViewType;
  setTicketView: React.Dispatch<React.SetStateAction<TicketViewType>>;
  resetFilters: () => void;

  sortOldToNew: boolean;
  setSortOldToNew: (sortByTime: boolean) => void;
  sortByStatus: string;
  setSortByStatus: (sortByStatus: SortByStatusType) => void;

  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

export default function HeroSector({
  searchQuery,
  setSearchQuery,
  ticketStatuses,
  ticketCategories,
  ticketDepartments,
  ticketEmployees,
  resetFilters,
  setOpenDropdownFilter,
  favoriteTickets,
  setFavoriteTickets,
  showFavorites,
  setShowFavorites,
  isManager,
  ticketView,
  setTicketView,
  sortOldToNew,
  setSortOldToNew,
  sortByStatus,
  setSortByStatus,
  className,
  inputRef,
  tickets,
  setTickets,
}: selectedTicketStatusesProps) {
  // const [title, id, date, description, status, priority, category] = mock;
  // const mock = mockData as Ticket[];
  const [activeModal, setActiveModal] = useState<{
    type: "view" | "edit" | "repeat" | "cancel";
    ticketId: number;
    from?: "view";
  } | null>(null);

  const mockCurrentUser = mockUser as UserType;
  const allActions = flattenActions(mockActionsNested as CategoryNode[]);

  const viewedTicket =
    activeModal?.type === "view"
      ? tickets.find((t) => t.ticketId === activeModal.ticketId)
      : undefined;

  const viewedAction = viewedTicket
    ? allActions.find((a) => a.id === viewedTicket.actionId)
    : undefined;

  const repeatTicket =
    activeModal?.type === "repeat"
      ? tickets.find((t) => t.ticketId === activeModal.ticketId)
      : undefined;

  const repeatAction = repeatTicket
    ? allActions.find((a) => a.id === repeatTicket.actionId)
    : undefined;

  function handleRepeatSubmit(data: {
    formData: Record<string, string>;
    multiData: Record<string, string[]>;
    priority: PriorityLevel;
  }) {
    if (!repeatTicket) return;

    const newTicket: Ticket = {
      ...repeatTicket,
      // TODO: change logic to receive ticketid from server
      ticketId: Math.max(...tickets.map((t) => t.ticketId)) + 1,
      createDate: new Date().toLocaleDateString("ru-RU"),
      status: "New",
      body: data.formData,
      multiBody: data.multiData,
      priority: data.priority,
      description: getTicketDescription(data.formData, repeatAction!),
      attachedFiles: [],
    };

    setTickets((prev) => [...prev, newTicket]);
    setActiveModal(null);
  }

  function ticketMatchesSearch(ticket: Ticket, query: string): boolean {
    return [
      ticket.title,
      ticket.description,
      ticket.createDate,
      ticket.ticketId.toString(),
      ticket.breadcrumbs[0],
    ].some((value) => value?.toLowerCase().includes(query.toLowerCase()));
  }

  function changePrioritySort() {
    switch (sortByStatus) {
      case "default":
        return setSortByStatus("new");
      case "new":
        return setSortByStatus("complete");
      case "complete":
        return setSortByStatus("default");
    }
  }

  const statusPriority = {
    New: 0,
    "In progress": 1,
    Paused: 2,
    Closed: 3,
    Cancelled: 4,
    Complete: 5,
  };

  const hasActiveFilters =
    ticketStatuses.some((i) => i !== "Все") ||
    ticketCategories.some((i) => i !== "Все") ||
    (ticketView === "team" &&
      (ticketDepartments.some((i) => i !== "Все") ||
        ticketEmployees.some((i) => i !== "Все")));

  const inputText =
    "Вы уверены, что хотите отменить заявку?\n\nЗаново запустить её в работу будет невозможно.";

  function onConfirm() {
    // отмена заявки: статус → Cancelled, id из activeModal
    if (activeModal?.type === "cancel") {
      setTickets((prev) =>
        prev.map((t) =>
          t.ticketId === activeModal.ticketId
            ? { ...t, status: "Cancelled" }
            : t,
        ),
      );
    }
    setActiveModal(null); // закрыть
  }

  function onCancel() {
    setActiveModal(null); // закрыть
  }

  function handleRequestCancel(ticketId: number) {
    setActiveModal({ type: "cancel", ticketId });
  }

  function handleRequestRepeat(ticketId: number) {
    setActiveModal({ type: "repeat", ticketId }); // без from — прямое открытие
  }

  function handleRepeatCancel() {
    if (activeModal?.from === "view") {
      setActiveModal({ type: "view", ticketId: activeModal.ticketId });
    } else {
      setActiveModal(null);
    }
  }

  function handleOpenView(ticketId: number) {
    setActiveModal({ type: "view", ticketId });
  }

  //TODO: Arrange functionality that manager can close (and cancel) employee tickets!!!
  return (
    <div
      className={`relative flex-1 max-w-225 min-w-130 h-246 flex flex-col items-center  rounded-xs border border-(--bg-border) bg-(--bg-primary-second) m-3 p-5 ${className} `}
    >
      {activeModal?.type === "cancel" && (
        <ConfirmModal
          onConfirm={onConfirm}
          onCancel={onCancel}
          inputText={inputText}
        />
      )}
      {activeModal?.type === "view" && (
        <ViewTicketModal
          ticket={viewedTicket}
          action={viewedAction}
          onClose={() => setActiveModal(null)}
          favoriteTickets={favoriteTickets}
          setFavoriteTickets={setFavoriteTickets}
          onCancel={handleRequestCancel}
          onRepeat={() => {
            if (viewedTicket) {
              setActiveModal({
                type: "repeat",
                ticketId: viewedTicket.ticketId,
                from: "view",
              });
            }
          }}

          // ... (позже кнопки edit/repeat/cancel)
        />
      )}
      {activeModal?.type === "repeat" && (
        <EditRepeatModal
          ticket={repeatTicket}
          action={repeatAction}
          onClose={handleRepeatCancel}
          onSubmit={handleRepeatSubmit}
          mode="repeat"
        />
      )}

      {/* Searchbar and icons for sort */}
      <div className="w-full flex items-center gap-2 mb-3.5 p-1">
        <Searchbar
          searchRequest={searchQuery}
          setSearchRequest={setSearchQuery}
          ref={inputRef}
          className={hoverAnimationStyle}
        />
        {/* Row of buttons */}
        <div className="flex justify-center items-center gap-1">
          <SearchMenuBtn
            onClick={() => setShowFavorites(!showFavorites)}
            icon={<FavoriteFilterBtn showFavorites={showFavorites} />}
            isActive={true}
          />
          {isManager && (
            <SearchMenuBtn
              icon={
                ticketView === "my" ? (
                  <UserIcon />
                ) : (
                  <ManagerIcon className="text-(--bg-btn-primary)" />
                )
              }
              onClick={() => {
                setTicketView(ticketView === "my" ? "team" : "my");
                setOpenDropdownFilter("Статус");
              }}
              isActive={true}
            />
          )}
          <SearchMenuBtn
            icon={
              sortOldToNew ? (
                <TimeSortActiveIcon className="text-(--bg-btn-primary)" />
              ) : (
                <TimeSortIcon />
              )
            }
            onClick={() => setSortOldToNew(!sortOldToNew)}
            isActive={true}
          />
          <SearchMenuBtn
            icon={
              sortByStatus === "default" ? (
                <PrioritySortIcon />
              ) : sortByStatus === "new" ? (
                <PriorityNewSortIcon className="text-(--bg-btn-primary)" />
              ) : (
                <PriorityCompleteSortIcon className="text-(--bg-btn-primary)" />
              )
            }
            onClick={() => changePrioritySort()}
            isActive={true}
          />
          <SearchMenuBtn
            icon={<DeleteFilterIcon />}
            onClick={() => {
              resetFilters();
            }}
            isActive={hasActiveFilters}
            inactiveClassName="bg-(--bg-border) dark:bg-(--bg-inactive-btn)"
          />
        </div>
      </div>

      {/* Ticket cards */}
      <div className="overflow-y-auto scrollbar-none w-full flex flex-1 flex-col justify-start items-center gap-2 select-none p-1">
        {tickets
          // Filter by Searchbar
          .filter((ticket) => ticketMatchesSearch(ticket, searchQuery))
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
          .filter(
            (ticket) =>
              !showFavorites || favoriteTickets.includes(ticket.ticketId),
          )
          .filter((ticket) =>
            isManager && ticketView === "team"
              ? ticket.userId !== mockCurrentUser.id
              : ticket.userId === mockCurrentUser.id,
          )
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
          })
          .map((ticket) => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
              favoriteTickets={favoriteTickets}
              setFavoriteTickets={setFavoriteTickets}
              ticketView={ticketView}
              setTickets={setTickets}
              onRequestCancel={handleRequestCancel}
              onRequestRepeat={handleRequestRepeat}
              handleOpenView={handleOpenView}
            />
          ))}
      </div>
    </div>
  );
}
