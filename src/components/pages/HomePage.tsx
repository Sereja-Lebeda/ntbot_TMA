import { useState } from "react";
import type { SortByStatusType } from "../../types/ticket.types";

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

  // States for btvs near searchbar
  const [favoriteTickets, setFavoriteTickets] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [viewAsManager, setViewAsManager] = useState(false);
  const [sortOldToNew, setSortOldToNew] = useState(false);
  const [sortByStatus, setSortByStatus] = useState<SortByStatusType>("default");

  return (
    <div>
      <Header />
      <div className="flex px-44">
        <Infoblock
          ticketStatuses={selectedStatuses}
          setTicketStatuses={setSelectedStatuses}
        />
        <HeroSector
          searchQuery={keyword}
          setSearchQuery={setKeyword}
          ticketStatuses={selectedStatuses}
          ticketCategories={selectedCategories}
          favoriteTickets={favoriteTickets}
          setFavoriteTickets={setFavoriteTickets}
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          viewAsManager={viewAsManager}
          setViewAsManager={setViewAsManager}
          sortOldToNew={sortOldToNew}
          setSortOldToNew={setSortOldToNew}
          sortByStatus={sortByStatus}
          setSortByStatus={setSortByStatus}
        />
        <SortFilterBlock
          openDropdownFilter={filter}
          setOpenDropdownFilter={setFilter}
          ticketStatuses={selectedStatuses}
          setTicketStatuses={setSelectedStatuses}
          ticketCategories={selectedCategories}
          setTicketCategories={setSelectedCategories}
        />
      </div>
      <p></p>
    </div>
  );
}
