import DeleteFilterIcon from "../icons/searchmenu/DeleteFilterIcon";
import FavoriteIcon from "../icons/searchmenu/FavoriteIcon";
import PrioritySortIcon from "../icons/searchmenu/PrioritySortIcon";
import TimeSortIcon from "../icons/searchmenu/TimeSortIcon";
import UserIcon from "../icons/searchmenu/UserIcon";
import TicketCard from "./TicketCard";
import Searchbar from "./ui/Searchbar";
import SearchMenuBtn from "./ui/SearchMenuBtn";

import mockData from "../../mockTicketInfo.json";
import type { Ticket } from "../types/ticket.types";
import getStatusTitle from "../utils/statusNameHelper";

interface selectedTicketStatusesProps {
  searchQuery: string;
  setSearchQuery: (req: string) => void;
  ticketStatuses: string[];
  ticketCategories: string[];
}

export default function HeroSector({
  searchQuery,
  setSearchQuery,
  ticketStatuses,
  ticketCategories,
}: selectedTicketStatusesProps) {
  // const [title, id, date, description, status, priority, category] = mock;
  const mock = mockData as Ticket[];

  function ticketMatchesSearch(ticket: Ticket, query: string): boolean {
    return [
      ticket.title,
      ticket.description,
      ticket.createDate,
      ticket.ticketId.toString(),
      ticket.category,
    ].some((value) => value.toLowerCase().includes(query.toLowerCase()));
  }

  return (
    <div className="w-225 h-246 flex flex-col justify-self-center items-center  rounded-xs border border-(--bg-border) bg-(--bg-primary-second) m-3 p-5">
      {/* Searchbar and icons for sort */}
      <div className="w-215 flex items-center gap-2 mb-3.5">
        <Searchbar
          searchRequest={searchQuery}
          setSearchRequest={setSearchQuery}
        />
        {/* Row of buttons */}
        <div className="flex justify-center items-center gap-1">
          <SearchMenuBtn icon={<FavoriteIcon />} />
          <SearchMenuBtn icon={<UserIcon />} />
          <SearchMenuBtn icon={<TimeSortIcon />} />
          <SearchMenuBtn icon={<PrioritySortIcon />} />
          {/* TODO: Add logic to change bg color */}
          <SearchMenuBtn icon={<DeleteFilterIcon />} />
        </div>
      </div>

      {/* Ticket cards */}
      <div className="w-216 h-222 flex flex-col justify-start items-center gap-2">
        {mock
          // Filter by Searchbar
          .filter((ticket) => ticketMatchesSearch(ticket, searchQuery))
          // Filter by filter side layout
          .filter(
            (ticket) =>
              (ticketStatuses.includes("Все") ||
                ticketStatuses.includes(
                  getStatusTitle(ticket.status, "statusBlock"),
                )) &&
              (ticketCategories.includes("Все") ||
                ticketCategories.includes(ticket.category)),
          )
          .map((ticket) => (
            <TicketCard key={ticket.ticketId} ticket={ticket} />
          ))}
      </div>
    </div>
  );
}
