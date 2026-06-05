import DropdownList from "./ui/DropdownList";
import mockData from "../../mockTicketInfo.json";
import type { Ticket } from "../types/ticket.types";

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
  viewAsManager: boolean;
}

const mock = mockData as Ticket[];

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
  viewAsManager,
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
    ...new Set(mock.map((ticket: Ticket) => ticket.category)),
  ];

  // const categories = [
  //   "Все",
  //   "Это другое",
  //   "Коммуникация",
  //   "Zdarova gaymeri",
  //   "Party",
  //   "Office",
  //   "Workflow",
  //   "Zdarova gaymeri",
  //   "Party",
  //   "Office",
  //   "Workflow",
  // ];

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
    // TODO: delete shrink 0 for adaptive interface
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="h-246 w-79 flex flex-col items-center my-3 gap-3 border border-(--bg-border) bg-(--bg-primary-second) rounded-xs shrink-0"
    >
      <div className="w-full flex flex-col items-start pt-5 px-2.5">
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
          // selectedItems={ticketStatuses}
          // setSelectedItems={setTicketStatuses}
        />
        <DropdownList
          title="Категории"
          isOpen={openDropdownFilter === "Категории"}
          items={categories}
          onChange={(title) => changeFilter(title)}
          selectedItems={ticketCategories}
          setSelectedItems={setTicketCategories}
        />
        {viewAsManager && (
          <DropdownList
            title="Отделы"
            isOpen={openDropdownFilter === "Отделы"}
            items={departments}
            onChange={(title) => changeFilter(title)}
            selectedItems={selectedDepartments}
            setSelectedItems={setSelectedDepartments}
          />
        )}
        {viewAsManager && (
          <DropdownList
            title="Сотрудники"
            isOpen={openDropdownFilter === "Сотрудники"}
            items={usernames}
            onChange={(title) => changeFilter(title)}
            selectedItems={selectedEmployees}
            setSelectedItems={setSelectedEmployees}
          />
        )}
      </div>
    </div>
  );
}

export default SortFilterBlock;
