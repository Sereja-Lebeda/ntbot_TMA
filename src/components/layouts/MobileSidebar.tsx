import { createPortal } from "react-dom";

import { useEffect, useRef, useState } from "react";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";
import useModalStackEntry from "../../hooks/useModalStackEntry";
import useUser from "../../hooks/useUser";

import {
  StatusesOfTicket,
  type SortByStatusType,
  type Ticket,
  type TicketViewType,
} from "../../types/ticket.types";

import { mock } from "../SortFilterBlock";

import CopyHint from "../ui/CopyHint";
import SearchMenuBtn from "../ui/Buttons/SearchMenuBtn";
import DropdownList from "../ui/DropdownList";
import SupportButtons from "../ui/Buttons/SupportButtons";

import { textPressAnimationStyle } from "../../styles/pressAnimation";

import MascootIcon from "../../icons/header/MascootIcon";
import PcIcon from "../../icons/infoblock/PcIcon";
import AccessIcon from "../../icons/infoblock/AccessIcon";
import IpIcon from "../../icons/infoblock/IpIcon";
import CrossIcon from "../../icons/card/CrossIcon";
import DeleteFilterIcon from "../../icons/searchmenu/DeleteFilterIcon";
import FavoriteFilterBtn from "../../icons/searchmenu/FavoriteFilterBtn";
import ManagerIcon from "../../icons/searchmenu/ManagerIcon";
import PriorityCompleteSortIcon from "../../icons/searchmenu/PriorityCompleteSortIcon";
import PriorityNewSortIcon from "../../icons/searchmenu/PriorityNewSortIcon";
import PrioritySortIcon from "../../icons/searchmenu/PrioritySortIcon";
import TimeSortActiveIcon from "../../icons/searchmenu/TimeSortActiveIcon";
import TimeSortIcon from "../../icons/searchmenu/TimeSortIcon";
import UserIcon from "../../icons/searchmenu/UserIcon";

interface MobileSidebarProps {
  closeSidebar: () => void;
  isAnimatingIn: boolean;

  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;

  ticketView: TicketViewType;
  setTicketView: React.Dispatch<React.SetStateAction<TicketViewType>>;

  filter: string | null;
  setFilter: (filter: string | null) => void;

  selectedStatuses: string[];
  setSelectedStatuses: (words: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (words: string[]) => void;
  selectedDepartments: string[];
  setSelectedDepartments: (words: string[]) => void;
  selectedEmployees: string[];
  setSelectedEmployees: (words: string[]) => void;

  sortOldToNew: boolean;
  setSortOldToNew: (sortByTime: boolean) => void;
  sortByStatus: SortByStatusType;

  changePrioritySort: () => void;
  resetFilters: () => void;
  hasActiveFilters: boolean | undefined;
  changeFilter: (status: string) => void;

  isPrivilegeUser: boolean;
}

function MobileSidebar({
  closeSidebar,
  isAnimatingIn,
  showFavorites,
  setShowFavorites,
  ticketView,
  setTicketView,
  filter,
  setFilter,
  selectedStatuses,
  setSelectedStatuses,
  selectedCategories,
  setSelectedCategories,
  selectedDepartments,
  setSelectedDepartments,
  selectedEmployees,
  setSelectedEmployees,
  sortOldToNew,
  setSortOldToNew,
  sortByStatus,
  changePrioritySort,
  resetFilters,
  hasActiveFilters,
  changeFilter,
  isPrivilegeUser,
}: MobileSidebarProps) {
  useLockBodyScroll();
  useModalStackEntry(closeSidebar);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // форсируем reflow — читаем layout-свойство сразу после монтирования
    void panelRef.current?.offsetHeight;
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isAnimatingIn) {
      void panelRef.current?.offsetHeight; // форсируем reflow перед показом
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isAnimatingIn]);

  const currentUser = useUser();

  const [copiedField, setCopiedField] = useState<"ip" | "pcName" | null>(null);

  if (!currentUser) return;

  const currentUsername = () => {
    const splitUsername = currentUser.name.split(" ");
    switch (splitUsername.length) {
      case 3:
      case 2:
        return splitUsername[1] + " " + splitUsername[0];
      default:
        return splitUsername[0];
    }
  };

  // Style for hints near user info
  const copyHintBase =
    "rounded-sm ml-auto px-1 transition-opacity duration-600 ease-in-out";
  const copyHintIpAnimation = `${copyHintBase} ${copiedField === "ip" ? "opacity-100" : "opacity-0"} `;
  const copyHintPcNameAnimation = `${copyHintBase} ${copiedField === "pcName" ? "opacity-100" : "opacity-0"} `;

  const baseStyle = "w-full flex items-center px-0.5 gap-2";
  const textStyle =
    "font-consolas text-sm font-normal text-(--text-secondary) select-none";

  const statuses = StatusesOfTicket;
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

  return createPortal(
    <div
      onClick={closeSidebar}
      className="
      fixed inset-0
      flex justify-start items-center
      bg-black/50 z-50

  "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        ref={panelRef}
        // NOTE: Duration should be equal as timeout duration in layout
        className={`
          w-8/10 h-dvh
          bg-(--bg-primary-second)
          flex flex-col justify-start items-start
          
          transition-transform duration-600 ${isVisible ? "translate-x-0" : "-translate-x-full"}
          `}
      >
        {/* Logo and cross */}
        <div
          className="w-full
        flex justify-between items-center
        bg-[#0e0e0e]
        px-5 py-4"
        >
          <div
            className="
          flex justify-center items-center
          gap-1"
          >
            <MascootIcon className="w-5 h-5" />
            <p className="text-2xl font-jbmono font-bold leading-7 select-none">
              NTBot
            </p>
          </div>
          <button onClick={closeSidebar} className="cursor-pointer">
            <CrossIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Infoblock */}
        {/* User Info */}
        <div
          className="w-full min-h-0 flex-1 flex flex-col
        overscroll-contain overflow-y-auto scrollbar-gutter-stable dropdown-scroll"
        >
          <div
            className="w-full h-fu
        flex flex-col justify-center items-start
        p-5 gap-3 border-y border-(--bg-border) bg-(--bg-primary-second)"
          >
            {/* User name */}
            <div
              className="w-full h-5
          flex items-start
          px-1"
            >
              <span className="font-jbmono text-(--text-primary) text-md font-normal leading-5 mb-3">
                {currentUsername()}
              </span>
            </div>

            {/* User pc Info */}
            <div className="w-full flex flex-col items-start gap-1.5">
              {/* user ip  */}
              <div
                onClick={() => {
                  navigator.clipboard.writeText(currentUser?.localIp);
                  setCopiedField("ip");
                  setTimeout(() => setCopiedField(null), 1000);
                }}
                className={`${baseStyle} cursor-pointer`}
              >
                <IpIcon />
                <span className={`${textStyle} ${textPressAnimationStyle} `}>
                  {currentUser?.localIp}
                </span>
                <span className={`${copyHintIpAnimation}`}>
                  <CopyHint />
                </span>
              </div>
              {/* pc name  */}
              <div
                onClick={() => {
                  navigator.clipboard.writeText(currentUser?.pcName);
                  setCopiedField("pcName");
                  setTimeout(() => setCopiedField(null), 1000);
                }}
                className={`${baseStyle} cursor-pointer`}
              >
                <div className="w-5 h-5 flex justify-center items-center">
                  <PcIcon />
                </div>

                <span className={`${textStyle} ${textPressAnimationStyle}`}>
                  {currentUser?.pcName}
                </span>
                <span className={`${copyHintPcNameAnimation}`}>
                  <CopyHint />
                </span>
              </div>
              {/* access date  */}
              <div className={baseStyle}>
                <div className="w-5 h-5 flex justify-center items-center dark:bg-[#A1FF6226] bg-[#71C13B40] rounded-xs">
                  <AccessIcon className="text-(--bg-task-complete) dark:text-(--bg-btn-primary)" />
                </div>
                {/* //TODO: Add ternar for access  */}
                <span className={textStyle}>
                  Доступ до {currentUser?.remoteAccessDate}
                </span>
              </div>
            </div>
          </div>

          {/* Filter btns */}
          {/* Row of buttons */}
          <div
            className="w-full h-21
          border-b border-(--bg-border)
        flex justify-evenly items-center
        p-5"
          >
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
                    <ManagerIcon className="text-(--bg-btn-primary)" />
                  )
                }
                onClick={() => {
                  setTicketView(ticketView === "my" ? "team" : "my");
                  setFilter("Статус");
                }}
                isActive={true}
              />
            )}
            <SearchMenuBtn
              icon={
                sortOldToNew ? (
                  <TimeSortActiveIcon className="text-(--bg-btn-primary)" />
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
                  <PriorityNewSortIcon className="text-(--bg-btn-primary)" />
                ) : (
                  <PriorityCompleteSortIcon className="text-(--bg-btn-primary)" />
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
              inactiveClassName="bg-(--bg-border) xl:dark:bg-(--bg-inactive-btn)"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="w-full flex flex-col items-start xl:pt-5 xl:px-2.5">
            <DropdownList
              title="Статус"
              isOpen={filter === "Статус"}
              items={statuses}
              onChange={(title) => changeFilter(title)}
              selectedItems={selectedStatuses}
              setSelectedItems={setSelectedStatuses}
              showResetButton={true}
            />
            <DropdownList
              title="Период"
              isOpen={filter === "Период"}
              items={statuses}
              onChange={(title) => changeFilter(title)}
              showResetButton={true}
            />
            <DropdownList
              title="Категории"
              isOpen={filter === "Категории"}
              items={categories}
              onChange={(title) => changeFilter(title)}
              selectedItems={selectedCategories}
              setSelectedItems={setSelectedCategories}
              showResetButton={true}
            />
            {isPrivilegeUser && ticketView === "team" && (
              <DropdownList
                title="Отделы"
                isOpen={filter === "Отделы"}
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
                isOpen={filter === "Сотрудники"}
                items={usernames}
                onChange={(title) => changeFilter(title)}
                selectedItems={selectedEmployees}
                setSelectedItems={setSelectedEmployees}
                showResetButton={true}
              />
            )}
          </div>
        </div>

        {/* Theme and tg btns */}
        <div className="w-full flex justify-center items-end p-5 bg-(--bg-primary-second) rounded-xs gap-2.5">
          <SupportButtons />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default MobileSidebar;
