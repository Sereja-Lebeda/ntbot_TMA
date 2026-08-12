import DeleteFilterIcon from "../icons/searchmenu/DeleteFilterIcon";
import FavoriteFilterBtn from "../icons/searchmenu/FavoriteFilterBtn";
import ManagerIcon from "../icons/searchmenu/ManagerIcon";
import PriorityCompleteSortIcon from "../icons/searchmenu/PriorityCompleteSortIcon";
import PriorityNewSortIcon from "../icons/searchmenu/PriorityNewSortIcon";
import PrioritySortIcon from "../icons/searchmenu/PrioritySortIcon";
import TimeSortActiveIcon from "../icons/searchmenu/TimeSortActiveIcon";
import TimeSortIcon from "../icons/searchmenu/TimeSortIcon";
import UserIcon from "../icons/searchmenu/UserIcon";

import SearchMenuBtn from "./ui/Buttons/SearchMenuBtn";
import Searchbar from "./ui/Searchbar";

import { hoverAnimationStyle } from "../styles/pressAnimation";
import type { Ticket, TicketViewType } from "../types/ticket.types";
import TicketCard from "./TicketCard";

interface DesktopHeroSectorProps {
  tickets: Ticket[]; // уже отфильтрованный и отсортированный массив
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;

  inputRef: React.RefObject<HTMLInputElement | null>;
  searchRequest: string;
  setSearchRequest: (word: string) => void;

  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;

  handleRequestCancel: (ticketId: number) => void;
  handleRequestRepeat: (ticketId: number) => void;
  handleRequestEdit: (ticketId: number) => void;
  handleOpenView: (ticketId: number) => void;

  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;

  ticketView: TicketViewType;
  setTicketView: React.Dispatch<React.SetStateAction<TicketViewType>>;
  resetFilters: () => void;

  sortOldToNew: boolean;
  setSortOldToNew: (sortByTime: boolean) => void;
  sortByStatus: string;
  changePrioritySort: () => void;

  setOpenDropdownFilter: (filter: string | null) => void;
  hasActiveFilters: boolean | undefined;

  isPrivilegeUser: boolean;
}

function DesktopHeroSector({
  tickets,
  setTickets,
  inputRef,
  searchRequest,
  setSearchRequest,
  favoriteTickets,
  setFavoriteTickets,
  showFavorites,
  setShowFavorites,
  ticketView,
  setTicketView,
  sortOldToNew,
  setSortOldToNew,
  sortByStatus,
  setOpenDropdownFilter,
  changePrioritySort,
  resetFilters,
  hasActiveFilters,
  isPrivilegeUser,
  handleOpenView,
  handleRequestCancel,
  handleRequestEdit,
  handleRequestRepeat,
}: DesktopHeroSectorProps) {
  return (
    <>
      {/* Searchbar and icons for sort */}
      <div className="xl:w-full xl:flex xl:items-center xl:gap-2 xl:mb-3.5 xl:p-1">
        <Searchbar
          searchRequest={searchRequest}
          setSearchRequest={setSearchRequest}
          ref={inputRef}
          className={hoverAnimationStyle}
        />
        {/* Row of buttons */}
        <div className="xl:flex xl:justify-center xl:items-center xl:gap-1">
          <SearchMenuBtn
            onClick={() => setShowFavorites(!showFavorites)}
            icon={<FavoriteFilterBtn showFavorites={showFavorites} />}
            isActive={true}
          />
          {isPrivilegeUser && (
            <SearchMenuBtn
              icon={
                ticketView === "my" ? (
                  <UserIcon />
                ) : (
                  <ManagerIcon className="xl:text-(--bg-btn-primary)" />
                )
              }
              onClick={() => {
                setTicketView(ticketView === "my" ? "team" : "my");
                setOpenDropdownFilter("Статус");
              }}
              isActive={true}
            />
          )}
          <SearchMenuBtn
            icon={
              sortOldToNew ? (
                <TimeSortActiveIcon className="xl:text-(--bg-btn-primary)" />
              ) : (
                <TimeSortIcon />
              )
            }
            onClick={() => setSortOldToNew(!sortOldToNew)}
            isActive={true}
          />
          <SearchMenuBtn
            icon={
              sortByStatus === "default" ? (
                <PrioritySortIcon />
              ) : sortByStatus === "new" ? (
                <PriorityNewSortIcon className="xl:text-(--bg-btn-primary)" />
              ) : (
                <PriorityCompleteSortIcon className="xl:text-(--bg-btn-primary)" />
              )
            }
            onClick={() => changePrioritySort()}
            isActive={true}
          />
          <SearchMenuBtn
            icon={<DeleteFilterIcon />}
            onClick={() => {
              resetFilters();
            }}
            isActive={hasActiveFilters}
            inactiveClassName="xl:bg-(--bg-border) xl:dark:bg-(--bg-inactive-btn)"
          />
        </div>
      </div>

      <div className="xl:overflow-y-auto xl:scrollbar-none xl:w-full xl:flex xl:flex-1 xl:flex-col xl:justify-start xl:items-center xl:gap-2 xl:select-none xl:p-1">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.ticketId}
            ticket={ticket}
            favoriteTickets={favoriteTickets}
            setFavoriteTickets={setFavoriteTickets}
            ticketView={ticketView}
            setTickets={setTickets}
            onRequestCancel={handleRequestCancel}
            onRequestRepeat={handleRequestRepeat}
            onRequestEdit={handleRequestEdit}
            handleOpenView={handleOpenView}
          />
        ))}
      </div>
    </>
  );
}

export default DesktopHeroSector;
