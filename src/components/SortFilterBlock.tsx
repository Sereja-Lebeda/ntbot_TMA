import DropdownList from "./ui/DropdownList";
import mockData from "../../mockTicketInfo.json";
import type { Ticket, TicketViewType } from "../types/ticket.types";

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

const mock = mockData as unknown as Ticket[];

function SortFilterBlock({
  openDropdownFilter,
  setOpenDropdownFilter,
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
  const statuses = [
    "Все",
    "Новые",
    "В работе",
    "На паузе",
    "Готовы",
    "Отклонены",
    "Закрыты",
  ];

  // TODO: pull categories from backend
  const categories = [
    "Все",
    ...new Set(mock.map((ticket: Ticket) => ticket.breadcrumbs[0])),
  ];

  // TODO: pull names from backend
  const usernames = [
    "Все",
    ...new Set(mock.map((ticket: Ticket) => ticket.userName)),
  ];

  // TODO: pull departments from backend
  const departments = [
    "Все",
    ...new Set(mock.map((ticket: Ticket) => ticket.department)),
  ];

  function changeFilter(name: string) {
    if (openDropdownFilter === name) {
      setOpenDropdownFilter(null);
    } else {
      if (name !== "Статус") setTicketStatuses(["Все"]);
      if (name !== "Категории") setTicketCategories(["Все"]);
      setOpenDropdownFilter(name);
    }
  }

  return (
    // TODO: delete shrink 0 for adaptive interface?
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="xl:h-246 xl:w-79 xl:flex xl:flex-col xl:items-center xl:my-3 xl:gap-3 xl:border xl:border-(--bg-border) xl:bg-(--bg-primary-second) xl:rounded-xs xl:shrink-0"
    >
      <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:pt-5 xl:px-2.5">
        <DropdownList
          title="Статус"
          isOpen={openDropdownFilter === "Статус"}
          items={statuses}
          onChange={(title) => changeFilter(title)}
          selectedItems={ticketStatuses}
          setSelectedItems={setTicketStatuses}
        />
        <DropdownList
          title="Период"
          isOpen={openDropdownFilter === "Период"}
          items={statuses}
          onChange={(title) => changeFilter(title)}
        />
        <DropdownList
          title="Категории"
          isOpen={openDropdownFilter === "Категории"}
          items={categories}
          onChange={(title) => changeFilter(title)}
          selectedItems={ticketCategories}
          setSelectedItems={setTicketCategories}
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
