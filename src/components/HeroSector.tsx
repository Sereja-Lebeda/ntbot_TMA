import { useState } from "react";
import useUser from "../hooks/useUser";

import type {
  Ticket,
  SortByStatusType,
  TicketViewType,
  TicketAttachmentType,
  StatusType,
} from "../types/ticket.types";

// import type { UserType } from "../types/user.types";
import type {
  CategoryNode,
  PriorityLevel,
  Action,
} from "../types/createTicket.type";

import TicketCard from "./TicketCard";
import Searchbar from "./ui/Searchbar";
import SearchMenuBtn from "./ui/Buttons/SearchMenuBtn";
import ConfirmModal from "./pages/modalCardWindows/ConfirmModal";
import ViewTicketModal from "./pages/modalCardWindows/ViewTicketModal";

import getStatusTitle from "../utils/ticketBadgeHelpers";
// import mockUser from "../../mockUserInfo.json";
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

  isPrivilegeUser: boolean;
  // isManager: boolean;
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
  isPrivilegeUser,
  // isManager,
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
  const currentUser = useUser();

  // const [title, id, date, description, status, priority, category] = mock;
  // const mock = mockData as Ticket[];
  const [activeModal, setActiveModal] = useState<{
    type: "view" | "edit" | "repeat" | "cancel";
    ticketId: number;
    from?: "view";
  } | null>(null);

  if (!currentUser) return null;

  // const mockCurrentUser = mockUser as UserType;
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

  const editTicket =
    activeModal?.type === "edit"
      ? tickets.find((t) => t.ticketId === activeModal.ticketId)
      : undefined;

  const editAction = editTicket
    ? allActions.find((a) => a.id === editTicket.actionId)
    : undefined;

  function handleRepeatSubmit(data: {
    formData: Record<string, string>;
    multiData: Record<string, string[]>;
    priority: PriorityLevel;
    attachedFiles: TicketAttachmentType;
  }) {
    if (!repeatTicket || !currentUser) return;

    const newTicket: Ticket = {
      ...repeatTicket,
      // TODO: change logic to receive ticketid from server
      ticketId: Math.max(...tickets.map((t) => t.ticketId)) + 1,
      createDate: new Date().toLocaleDateString("ru-RU"),
      status: "New",
      userId: currentUser.id,
      userName: currentUser.name,
      department: currentUser.department,
      body: data.formData,
      multiBody: data.multiData,
      priority: data.priority,
      description: getTicketDescription(data.formData, repeatAction!),
      attachedFiles: data.attachedFiles,
    };

    setTickets((prev) => [...prev, newTicket]);
    setActiveModal(null);
  }

  function handleEditSubmit(data: {
    formData: Record<string, string>;
    multiData: Record<string, string[]>;
    priority: PriorityLevel;
    action: Action;
    attachedFiles: TicketAttachmentType;
    status: StatusType;
  }) {
    if (!editTicket) return;

    const newBreadcrumbs = [
      data.action.category,
      data.action.subcategory,
      data.action.name,
    ];

    setTickets((prev) =>
      prev.map((t) =>
        t.ticketId === editTicket.ticketId
          ? {
              ...t,
              body: data.formData,
              multiBody: data.multiData,
              priority: data.priority,
              actionId: data.action.id,
              breadcrumbs: newBreadcrumbs,
              description: getTicketDescription(data.formData, data.action),
              attachedFiles: data.attachedFiles,
              status: data.status,
            }
          : t,
      ),
    );
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

  function handleRequestEdit(ticketId: number) {
    setActiveModal({ type: "edit", ticketId }); // без from
  }

  function handleRepeatCancel() {
    if (activeModal?.from === "view") {
      setActiveModal({ type: "view", ticketId: activeModal.ticketId });
    } else {
      setActiveModal(null);
    }
  }

  function handleEditCancel() {
    if (activeModal?.from === "view") {
      setActiveModal({ type: "view", ticketId: activeModal.ticketId });
    } else {
      setActiveModal(null);
    }
  }

  function handleStatusChange(ticketId: number, newStatus: StatusType) {
    setTickets((prev) =>
      prev.map((t) =>
        t.ticketId === ticketId ? { ...t, status: newStatus } : t,
      ),
    );
  }

  function handleOpenView(ticketId: number) {
    setActiveModal({ type: "view", ticketId });
  }

  return (
    <div
      className={`xl:relative xl:flex-1 xl:max-w-225 xl:min-w-130 xl:h-246 xl:flex xl:flex-col xl:items-center xl:rounded-xs xl:border xl:border-(--bg-border) xl:bg-(--bg-primary-second) xl:m-3 xl:p-5 ${className} `}
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
          onSubmit={handleRepeatSubmit}
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
          onSubmit={handleEditSubmit}
          mode="edit"
          favoriteTickets={favoriteTickets}
          setFavoriteTickets={setFavoriteTickets}
        />
      )}

      {/* Searchbar and icons for sort */}
      <div className="xl:w-full xl:flex xl:items-center xl:gap-2 xl:mb-3.5 xl:p-1">
        <Searchbar
          searchRequest={searchQuery}
          setSearchRequest={setSearchQuery}
          ref={inputRef}
          className={hoverAnimationStyle}
        />
        {/* Row of buttons */}
        <div className="xl:flex xl:justify-center xl:items-center xl:gap-1">
          <SearchMenuBtn
            onClick={() => setShowFavorites(!showFavorites)}
            icon={<FavoriteFilterBtn showFavorites={showFavorites} />}
            isActive={true}
          />
          {isPrivilegeUser && (
            <SearchMenuBtn
              icon={
                ticketView === "my" ? (
                  <UserIcon />
                ) : (
                  <ManagerIcon className="xl:text-(--bg-btn-primary)" />
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
                <TimeSortActiveIcon className="xl:text-(--bg-btn-primary)" />
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
                <PriorityNewSortIcon className="xl:text-(--bg-btn-primary)" />
              ) : (
                <PriorityCompleteSortIcon className="xl:text-(--bg-btn-primary)" />
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
            inactiveClassName="xl:bg-(--bg-border) xl:dark:bg-(--bg-inactive-btn)"
          />
        </div>
      </div>

      {/* Ticket cards */}
      <div className="xl:overflow-y-auto xl:scrollbar-none xl:w-full xl:flex xl:flex-1 xl:flex-col xl:justify-start xl:items-center xl:gap-2 xl:select-none xl:p-1">
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
          // Filter by favorite tickets
          .filter(
            (ticket) =>
              !showFavorites || favoriteTickets.includes(ticket.ticketId),
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
              onRequestEdit={handleRequestEdit}
              handleOpenView={handleOpenView}
            />
          ))}
      </div>
    </div>
  );
}
