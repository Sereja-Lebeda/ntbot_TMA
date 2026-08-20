import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import useSearch from "../../hooks/useSearch";

import Searchbar from "../ui/Searchbar";

import BurgerIcon from "../../icons/header/BurgerIcon";
import MascootIcon from "../../icons/header/MascootIcon";
import MagnifyIcon from "../../icons/searchmenu/MagnifyIcon";

interface MobileHeaderProps {
  openSidebar: () => void;
}

function MobileHeader({ openSidebar }: MobileHeaderProps) {
  const { searchRequest, setSearchRequest } = useSearch();

  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchbarOpen, setIsSearchbarOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isSearchbarOpen) {
      inputRef.current?.focus();
      setSearchRequest("");
    }
  }, [isSearchbarOpen, setSearchRequest]);

  const isOnMainPage = location.pathname === "/";

  return (
    <div
      className="fixed w-full h-15.5 top-0
  flex justify-between items-center
  bg-[#0e0e0e] border-b border-[#201e1e]
  px-5 py-4 z-40"
    >
      <button onClick={openSidebar} className="outline-none cursor-pointer">
        <BurgerIcon
          className="w-5 h-5
        text-(--text-secondary)
        hover:text-[#ede8de]"
        />
      </button>

      {isSearchbarOpen ? (
        <Searchbar
          searchRequest={searchRequest}
          setSearchRequest={setSearchRequest}
          variant="mobile"
          ref={inputRef}
        />
      ) : (
        <button
          className="flex justify-center items-center gap-1 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <MascootIcon className="w-5 h-5" />
          <p className="text-2xl font-jbmono font-bold leading-7 select-none">
            NTBot
          </p>
        </button>
      )}

      <button
        onClick={() => setIsSearchbarOpen((prev) => !prev)}
        className={`
          ${isOnMainPage ? "visible" : "invisible"}
          cursor-pointer`}
        disabled={!isOnMainPage}
      >
        <MagnifyIcon
          className="w-5 h-5
        text-(--text-secondary)
        hover:text-[#ede8de]"
        />
      </button>
    </div>
  );
}

export default MobileHeader;
