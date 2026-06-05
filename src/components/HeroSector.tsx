import { useState } from "react";

import type { Ticket, SortByStatusType } from "../types/ticket.types";
import type { UserType } from "../types/user.types";
import getStatusTitle from "../utils/statusNameHelper";
import ManagerIcon from "../icons/searchmenu/ManagerIcon";
// import mockData from "../../mockTicketInfo.json";
import mockUser from "../../mockUserInfo.json";

import DeleteFilterIcon from "../icons/searchmenu/DeleteFilterIcon";
import FavoriteFilterBtn from "../icons/searchmenu/FavoriteFilterBtn";
import PrioritySortIcon from "../icons/searchmenu/PrioritySortIcon";
import PriorityNewSortIcon from "../icons/searchmenu/PriorityNewSortIcon";
import PriorityCompleteSortIcon from "../icons/searchmenu/PriorityCompleteSortIcon";
import TimeSortIcon from "../icons/searchmenu/TimeSortIcon";
import TimeSortActiveIcon from "../icons/searchmenu/TimeSortActiveIcon";

import TicketCard from "./TicketCard";
import Searchbar from "./ui/Searchbar";
import SearchMenuBtn from "./ui/SearchMenuBtn";
import UserIcon from "../icons/searchmenu/UserIcon";

interface selectedTicketStatusesProps {
  className?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  setSearchQuery: (req: string) => void;

  ticketStatuses: string[];
  ticketCategories: string[];
  ticketDepartments: string[];
  ticketEmployees: string[];

  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;

  viewAsManager: boolean;
  setViewAsManager: (isManager: boolean) => void;

  sortOldToNew: boolean;
  setSortOldToNew: (sortByTime: boolean) => void;
  sortByStatus: string;
  setSortByStatus: (sortByStatus: SortByStatusType) => void;

  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

export default function HeroSector({
  searchQuery,
  setSearchQuery,
  ticketStatuses,
  ticketCategories,
  ticketDepartments,
  ticketEmployees,
  favoriteTickets,
  setFavoriteTickets,
  showFavorites,
  setShowFavorites,
  viewAsManager,
  setViewAsManager,
  sortOldToNew,
  setSortOldToNew,
  sortByStatus,
  setSortByStatus,
  className,
  inputRef,
  tickets,
  setTickets,
}: selectedTicketStatusesProps) {
  // const [title, id, date, description, status, priority, category] = mock;
  // const mock = mockData as Ticket[];
  const mockUserManager = mockUser as UserType;

  const [ticketView, setTicketView] = useState<"my" | "team">("my");

  function ticketMatchesSearch(ticket: Ticket, query: string): boolean {
    return [
      ticket.title,
      ticket.description,
      ticket.createDate,
      ticket.ticketId.toString(),
      ticket.category,
    ].some((value) => value.toLowerCase().includes(query.toLowerCase()));
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

  const statusPriority = {
    New: 0,
    "In progress": 1,
    Paused: 2,
    Closed: 3,
    Cancelled: 4,
    Complete: 5,
  };

  const hasActiveFilters =
    showFavorites ||
    viewAsManager ||
    sortOldToNew ||
    sortByStatus !== "default";
  // console.log(ticketDepartments, ticketEmployees);

  return (
    <div
      className={`relative w-225 h-246 flex flex-col justify-self-center items-center  rounded-xs border border-(--bg-border) bg-(--bg-primary-second) m-3 p-5 ${className} `}
    >
      {/* Searchbar and icons for sort */}
      <div className="w-215 flex items-center gap-2 mb-3.5 ">
        <Searchbar
          searchRequest={searchQuery}
          setSearchRequest={setSearchQuery}
          ref={inputRef}
        />
        {/* Row of buttons */}
        <div className="flex justify-center items-center gap-1">
          <SearchMenuBtn
            onClick={() => setShowFavorites(!showFavorites)}
            icon={<FavoriteFilterBtn showFavorites={showFavorites} />}
            isActive={true}
          />
          {viewAsManager && (
            <SearchMenuBtn
              icon={ticketView === "my" ? <UserIcon /> : <ManagerIcon />}
              onClick={() => setTicketView(ticketView === "my" ? "team" : "my")}
              isActive={true}
            />
          )}
          <SearchMenuBtn
            icon={sortOldToNew ? <TimeSortActiveIcon /> : <TimeSortIcon />}
            onClick={() => setSortOldToNew(!sortOldToNew)}
            isActive={true}
          />
          <SearchMenuBtn
            icon={
              sortByStatus === "default" ? (
                <PrioritySortIcon />
              ) : sortByStatus === "new" ? (
                <PriorityNewSortIcon />
              ) : (
                <PriorityCompleteSortIcon />
              )
            }
            onClick={() => changePrioritySort()}
            isActive={true}
          />
          <SearchMenuBtn
            icon={<DeleteFilterIcon />}
            onClick={() => {
              setShowFavorites(false);
              setViewAsManager(false);
              setSortOldToNew(false);
              setSortByStatus("default");
            }}
            isActive={hasActiveFilters}
            inactiveClassName="dark:bg-(--bg-inactive-btn)"
          />
        </div>
      </div>

      {/* Ticket cards */}
      <div className="overflow-y-auto scrollbar-none w-217 flex flex-1 flex-col justify-start items-center gap-2 select-none p-1">
        {tickets
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
                ticketCategories.includes(ticket.category)) &&
              (ticketDepartments.includes("Все") ||
                ticketDepartments.includes(ticket.department ?? "")) &&
              (ticketEmployees.includes("Все") ||
                ticketEmployees.includes(ticket.userName ?? "")),
          )
          .filter(
            (ticket) =>
              !showFavorites || favoriteTickets.includes(ticket.ticketId),
          )
          .filter((ticket) =>
            !viewAsManager
              ? true
              : ticketView === "my"
                ? ticket.userName === mockUserManager.name
                : ticket.userName !== mockUserManager.name,
          )
          .sort((a, b) =>
            sortOldToNew
              ? Date.parse(a.createDate.split(".").reverse().join("-")) -
                Date.parse(b.createDate.split(".").reverse().join("-"))
              : Date.parse(b.createDate.split(".").reverse().join("-")) -
                Date.parse(a.createDate.split(".").reverse().join("-")),
          )
          .sort((a, b) => {
            if (sortByStatus === "default") return 0;
            if (sortByStatus === "new") {
              return statusPriority[a.status] - statusPriority[b.status];
            }

            if (sortByStatus === "complete") {
              return statusPriority[b.status] - statusPriority[a.status];
            }
            return 0;
          })
          .map((ticket) => (
            <TicketCard
              key={ticket.ticketId}
              ticket={ticket}
              favoriteTickets={favoriteTickets}
              setFavoriteTickets={setFavoriteTickets}
              ticketView={ticketView}
              setTickets={setTickets}
            />
          ))}
      </div>
    </div>
  );
}
