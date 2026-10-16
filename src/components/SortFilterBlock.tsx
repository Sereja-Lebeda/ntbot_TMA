import { useOutletContext } from "react-router";
import {
  StatusesOfTicket,
  type Ticket,
  type TicketViewType,
} from "../types/ticket.types";
import getFilterOptions from "../utils/getFilterOptions";
import DropdownList from "./ui/DropdownList";

export interface OpenDropdownFilterProps {
  openDropdownFilter: string | null;
  setOpenDropdownFilter: (filter: string | null) => void;
  ticketStatuses: string[];
  setTicketStatuses: (status: string[]) => void;
  ticketCategories: string[];
  setTicketCategories: (category: string[]) => void;
  selectedDepartments: string[];
  setSelectedDepartments: (department: string[]) => void;
  selectedEmployees: string[];
  setSelectedEmployees: (employee: string[]) => void;
  isPrivilegeUser: boolean;
  ticketView: TicketViewType;
}

interface OutletContextProps {
  changeFilter: (status: string) => void;
  visibleTickets: Ticket[];
}

function SortFilterBlock({
  openDropdownFilter,
  ticketStatuses,
  setTicketStatuses,
  ticketCategories,
  setTicketCategories,
  selectedDepartments,
  setSelectedDepartments,
  selectedEmployees,
  setSelectedEmployees,
  isPrivilegeUser,
  ticketView,
}: OpenDropdownFilterProps) {
  const { changeFilter, visibleTickets } =
    useOutletContext<OutletContextProps>();

  const statuses = StatusesOfTicket;

  const { categories, departments, usernames } =
    getFilterOptions(visibleTickets);

  return (
    // TODO: delete shrink 0 for adaptive interface?
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="xl:h-full xl:w-79 xl:flex xl:flex-col xl:items-center xl:gap-3 xl:border xl:border-(--bg-border) xl:bg-(--bg-primary-second) xl:rounded-xs xl:shrink-0 xl:overflow-y-auto xl:overflow-x-hidden scrollbar-gutter-stable dropdown-scroll"
    >
      <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:pt-5 xl:px-2.5">
        <DropdownList
          title="Статус"
          isOpen={openDropdownFilter === "Статус"}
          items={statuses}
          onChange={(title) => changeFilter(title)}
          selectedItems={ticketStatuses}
          setSelectedItems={setTicketStatuses}
          showResetButton={true}
        />
        <DropdownList
          title="Период"
          isOpen={openDropdownFilter === "Период"}
          items={statuses}
          onChange={(title) => changeFilter(title)}
          showResetButton={true}
        />
        <DropdownList
          title="Категории"
          isOpen={openDropdownFilter === "Категории"}
          items={categories}
          onChange={(title) => changeFilter(title)}
          selectedItems={ticketCategories}
          setSelectedItems={setTicketCategories}
          showResetButton={true}
        />
        {isPrivilegeUser && ticketView === "team" && (
          <DropdownList
            title="Отделы"
            isOpen={openDropdownFilter === "Отделы"}
            items={departments}
            onChange={(title) => changeFilter(title)}
            selectedItems={selectedDepartments}
            setSelectedItems={setSelectedDepartments}
            showResetButton={true}
          />
        )}
        {isPrivilegeUser && ticketView === "team" && (
          <DropdownList
            title="Сотрудники"
            isOpen={openDropdownFilter === "Сотрудники"}
            items={usernames}
            onChange={(title) => changeFilter(title)}
            selectedItems={selectedEmployees}
            setSelectedItems={setSelectedEmployees}
            showResetButton={true}
          />
        )}
      </div>
    </div>
  );
}

export default SortFilterBlock;
