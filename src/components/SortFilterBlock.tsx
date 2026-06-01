import DropdownList from "./ui/DropdownList";

export interface OpenDropdownFilterProps {
  openDropdownFilter: string | null;
  setOpenDropdownFilter: (filter: string | null) => void;
  ticketStatuses: string[];
  setTicketStatuses: (status: string[]) => void;
  ticketCategories: string[];
  setTicketCategories: (category: string[]) => void;
}

function SortFilterBlock({
  openDropdownFilter,
  setOpenDropdownFilter,
  ticketStatuses,
  setTicketStatuses,
  ticketCategories,
  setTicketCategories,
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

  const categories = [
    "Все",
    "Это другое",
    "Коммуникация",
    "Zdarova gaymeri",
    "Party",
    "Office",
    "Workflow",
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
      </div>
    </div>
  );
}

export default SortFilterBlock;
