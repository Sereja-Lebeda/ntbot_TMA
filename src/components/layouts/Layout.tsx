import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";

import type { activeSectionType } from "../../types/header.types";
import type { SortByStatusType } from "../../types/ticket.types";

import Header from "./Header";
import MobileSidebar from "./MobileSidebar";

export default function Layout() {
  const currentUser = useUser();

  const [shouldSidebarRebder, setShouldSidebarRender] = useState(false);
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
      // if (name !== "Статус") setSelectedStatuses(["Все"]);
      // if (name !== "Категории") setSelectedCategories(["Все"]);
      setFilter(name);
    }
  }

  function openSidebar() {
    setSidebarOpen(true);
  }

  function closeSidebar() {
    setSidebarOpen(false);
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
      {shouldSidebarRebder && (
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
        }}
      />{" "}
      {/* сюда подставляется страница */}
    </div>
  );
}
