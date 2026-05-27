import { useState } from "react";

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
