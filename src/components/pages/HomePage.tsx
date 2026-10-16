import { useOutletContext } from "react-router";
import { useRef } from "react";
import useUser from "../../hooks/useUser";
import useMediaQuery from "../../hooks/useMediaQuery";
import type {
  SortByStatusType,
  Ticket,
  TicketViewType,
} from "../../types/ticket.types";

import HeroSector from "../HeroSector";
import Infoblock from "../Infoblock";
import SortFilterBlock from "../SortFilterBlock";

interface OutletContextProps {
  selectedStatuses: string[];
  setSelectedStatuses: (words: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (words: string[]) => void;
  selectedDepartments: string[];
  setSelectedDepartments: (words: string[]) => void;
  selectedEmployees: string[];
  setSelectedEmployees: (words: string[]) => void;

  favoriteTickets: number[];
  setFavoriteTickets: (number: number[]) => void;
  showFavorites: boolean;
  setShowFavorites: (boolean: boolean) => void;

  sortByStatus: SortByStatusType;
  sortOldToNew: boolean;
  setSortOldToNew: (boolean: boolean) => void;
  ticketView: TicketViewType;
  setTicketView: React.Dispatch<React.SetStateAction<TicketViewType>>;

  filter: string | null;
  setFilter: (dropdown: string | null) => void;
  resetFilters: () => void;
  changePrioritySort: () => void;
  hasActiveFilters: boolean | undefined;

  visibleTickets: Ticket[];
}

export default function HomePage() {
  const {
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
    ticketView,
    setTicketView,
    filter,
    setFilter,
    resetFilters,
    changePrioritySort,
    hasActiveFilters,
    visibleTickets,
  } = useOutletContext<OutletContextProps>();
  const isDesktop = useMediaQuery("(min-width:1280px)");

  const { user: currentUser } = useUser();

  const isPrivilegeUser =
    currentUser?.role === "admin" || currentUser?.role === "manager";

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        const isFormElement = target.closest(
          'input, textarea, select, [contenteditable="true"]',
        );
        if (e.target !== inputRef.current && !isFormElement) {
          e.preventDefault();
          inputRef.current?.blur();
        }
      }}
      className="h-full"
    >
      <div className="h-full xl:flex xl:justify-center xl:max-w-395 xl:mx-auto xl:p-3">
        {isDesktop && (
          <Infoblock
            ticketStatuses={selectedStatuses}
            setTicketStatuses={setSelectedStatuses}
            visibleTickets={visibleTickets}
          />
        )}
        <HeroSector
          className={"xl:sticky xl:top-0"}
          // searchbar
          inputRef={inputRef}
          // filters for tickets
          ticketStatuses={selectedStatuses}
          setTicketStatuses={setSelectedStatuses}
          ticketCategories={selectedCategories}
          ticketDepartments={selectedDepartments}
          ticketEmployees={selectedEmployees}
          resetFilters={resetFilters}
          setOpenDropdownFilter={setFilter}
          hasActiveFilters={hasActiveFilters}
          // favorite btn
          favoriteTickets={favoriteTickets}
          setFavoriteTickets={setFavoriteTickets}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          // manager feat btn
          isPrivilegeUser={isPrivilegeUser}
          ticketView={ticketView}
          setTicketView={setTicketView}
          // sort btns near searchbar
          sortOldToNew={sortOldToNew}
          setSortOldToNew={setSortOldToNew}
          sortByStatus={sortByStatus}
          //sort function
          changePrioritySort={changePrioritySort}
        />
        {isDesktop && (
          <SortFilterBlock
            // ui filters
            openDropdownFilter={filter}
            setOpenDropdownFilter={setFilter}
            // filters for tickets
            ticketStatuses={selectedStatuses}
            setTicketStatuses={setSelectedStatuses}
            ticketCategories={selectedCategories}
            setTicketCategories={setSelectedCategories}
            selectedDepartments={selectedDepartments}
            setSelectedDepartments={setSelectedDepartments}
            selectedEmployees={selectedEmployees}
            setSelectedEmployees={setSelectedEmployees}
            // manager feat btn
            isPrivilegeUser={isPrivilegeUser}
            ticketView={ticketView}
          />
        )}
      </div>
    </div>
  );
}
