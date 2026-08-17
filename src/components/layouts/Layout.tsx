import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import useMediaQuery from "../../hooks/useMediaQuery";

import type { activeSectionType } from "../../types/header.types";
import type {
  SortByStatusType,
  StatusType,
  Ticket,
  TicketAttachmentType,
} from "../../types/ticket.types";
import type { PriorityLevel, Action } from "../../types/createTicket.type";
import type { ModalTypes } from "../../types/modalTypes";

import Header from "./Header";
import MobileSidebar from "./MobileSidebar";
import Footer from "./Footer";
import ConfirmModal from "../pages/modalCardWindows/ConfirmModal";

import getTicketDescription from "../../utils/getTicketDescription";

import mockData from "../../../mockTicketInfo.json";

export default function Layout() {
  const currentUser = useUser();
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const [shouldSidebarRender, setShouldSidebarRender] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let renderTime: number | undefined;
    if (sidebarOpen) {
      setShouldSidebarRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimatingIn(true);
        });
      });
    } else {
      // NOTE: Timeout duration should be equal as animation duration in components
      renderTime = setTimeout(() => setShouldSidebarRender(false), 600);
      setIsAnimatingIn(false);
    }

    return () => {
      clearTimeout(renderTime);
    };
  }, [sidebarOpen]);

  const isPrivilegeUser =
    currentUser?.role === "admin" || currentUser?.role === "manager";

  const [activeSection, setActiveSection] =
    useState<activeSectionType>("tickets");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["Все"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Все",
  ]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    "Все",
  ]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(["Все"]);

  // States for btns near searchbar on desktop version
  const [favoriteTickets, setFavoriteTickets] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortOldToNew, setSortOldToNew] = useState(false);
  const [sortByStatus, setSortByStatus] = useState<SortByStatusType>("default");
  const [ticketView, setTicketView] = useState<"my" | "team">("my");

  const [filter, setFilter] = useState<string | null>("Статус"); // какой дроп открыт

  // Modal states
  const [tickets, setTickets] = useState<Ticket[]>(
    mockData as unknown as Ticket[],
  );
  const [activeModal, setActiveModal] = useState<ModalTypes>(null);
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
  // End modal functions

  const hasActiveFilters =
    selectedStatuses.some((i) => i !== "Все") ||
    selectedCategories.some((i) => i !== "Все") ||
    (ticketView === "team" &&
      (selectedDepartments.some((i) => i !== "Все") ||
        selectedEmployees.some((i) => i !== "Все")));

  function resetFilters() {
    setSelectedStatuses(["Все"]);
    setSelectedCategories(["Все"]);
    setSelectedDepartments(["Все"]);
    setSelectedEmployees(["Все"]);
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

  function changeFilter(name: string) {
    if (filter === name) {
      setFilter(null);
    } else {
      setFilter(name);
    }
  }

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  // For confirm modal window
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

  function onCancelConfirmModal() {
    if (!isDesktop) {
      setActiveModal(null);
    } else {
      if (activeModal?.from === "view") {
        setActiveModal({ type: "view", ticketId: activeModal.ticketId });
      } else {
        setActiveModal(null);
      }
    }
  }

  function handleRepeatSubmit(
    data: {
      formData: Record<string, string>;
      multiData: Record<string, string[]>;
      priority: PriorityLevel;
      attachedFiles: TicketAttachmentType;
    },
    repeatTicket: Ticket | undefined,
    repeatAction: Action | undefined,
  ) {
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

  function handleEditSubmit(
    data: {
      formData: Record<string, string>;
      multiData: Record<string, string[]>;
      priority: PriorityLevel;
      action: Action;
      attachedFiles: TicketAttachmentType;
      status: StatusType;
    },
    editTicket: Ticket | undefined,
  ) {
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

  return (
    <div

    // onMouseDown={(e) => e.preventDefault()}
    /* твой onMouseDown для blur инпута, если нужен глобально */
    >
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        openSidebar={openSidebar}
      />
      {shouldSidebarRender && (
        <MobileSidebar
          closeSidebar={closeSidebar}
          isAnimatingIn={isAnimatingIn}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          ticketView={ticketView}
          setTicketView={setTicketView}
          setFilter={setFilter}
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedDepartments={selectedDepartments}
          setSelectedDepartments={setSelectedDepartments}
          selectedEmployees={selectedEmployees}
          setSelectedEmployees={setSelectedEmployees}
          sortOldToNew={sortOldToNew}
          setSortOldToNew={setSortOldToNew}
          sortByStatus={sortByStatus}
          changePrioritySort={changePrioritySort}
          resetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          isPrivilegeUser={isPrivilegeUser}
          changeFilter={changeFilter}
          filter={filter}
        />
      )}
      {activeModal?.type === "cancel" && (
        <ConfirmModal
          onConfirm={onConfirm}
          onCancel={onCancelConfirmModal}
          inputText={inputText}
        />
      )}
      <Outlet
        context={{
          selectedStatuses,
          setSelectedStatuses,
          selectedCategories,
          setSelectedCategories,
          selectedDepartments,
          setSelectedDepartments,
          selectedEmployees,
          setSelectedEmployees,
          favoriteTickets,
          setFavoriteTickets,
          showFavorites,
          setShowFavorites,
          sortOldToNew,
          setSortOldToNew,
          sortByStatus,
          setSortByStatus,
          ticketView,
          setTicketView,
          filter,
          setFilter,
          resetFilters,
          changePrioritySort,
          hasActiveFilters,
          changeFilter,
          tickets,
          setTickets,
          activeModal,
          setActiveModal,
          handleRequestCancel,
          handleStatusChange,
          handleRepeatCancel,
          handleEditCancel,
          handleRequestEdit,
          handleRequestRepeat,
          handleOpenView,
          handleRepeatSubmit,
          handleEditSubmit,
        }}
      />
      {/* сюда подставляется страница */}
      <Footer
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />{" "}
    </div>
  );
}
