import { useState, useRef } from "react";
import type { SortByStatusType, Ticket } from "../../types/ticket.types";
import type { activeSectionType } from "../../types/header.types";
import type { UserType } from "../../types/user.types";
import mockUser from "../../../mockUserInfo.json";
import mockData from "../../../mockTicketInfo.json";

import HeroSector from "../HeroSector";
import Header from "../layouts/Header";
import Infoblock from "../Infoblock";
import SortFilterBlock from "../SortFilterBlock";

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<string | null>("Статус"); // какой дроп открыт
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["Все"]);
  // const [selectedPeriods, setSelectedPeriods] = useState<string[]>(["Все"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Все",
  ]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([
    "Все",
  ]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(["Все"]);

  const mock = mockUser as UserType;
  // States for btns near searchbar
  const [favoriteTickets, setFavoriteTickets] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [viewAsManager, setViewAsManager] = useState(mock.isManager);
  const [sortOldToNew, setSortOldToNew] = useState(false);
  const [sortByStatus, setSortByStatus] = useState<SortByStatusType>("default");

  // States for btns "yes/no" for complete tickets
  const [tickets, setTickets] = useState<Ticket[]>(mockData as Ticket[]);

  // State for which section should be reflected
  const [activeSection, setActiveSection] =
    useState<activeSectionType>("tickets");

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onMouseDown={(e) => {
        if (e.target !== inputRef.current) {
          e.preventDefault();
          inputRef.current?.blur();
        }
      }}
      className=""
    >
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex px-44">
        <Infoblock
          ticketStatuses={selectedStatuses}
          setTicketStatuses={setSelectedStatuses}
        />
        <HeroSector
          className={"sticky top-0"}
          // searchbar
          inputRef={inputRef}
          searchQuery={keyword}
          setSearchQuery={setKeyword}
          // filters for tickets
          ticketStatuses={selectedStatuses}
          ticketCategories={selectedCategories}
          ticketDepartments={selectedDepartments}
          ticketEmployees={selectedEmployees}
          // favorite btn
          favoriteTickets={favoriteTickets}
          setFavoriteTickets={setFavoriteTickets}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          // manager feat btn
          viewAsManager={viewAsManager}
          setViewAsManager={setViewAsManager}
          // sort btns near searchbar
          sortOldToNew={sortOldToNew}
          setSortOldToNew={setSortOldToNew}
          sortByStatus={sortByStatus}
          setSortByStatus={setSortByStatus}
          //yes-no btns for complete ticket
          tickets={tickets}
          setTickets={setTickets}
        />
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
          viewAsManager={viewAsManager}
        />
      </div>
      <p></p>
    </div>
  );
}
