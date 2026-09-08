import { forwardRef } from "react";

import MagnifyIcon from "../../icons/searchmenu/MagnifyIcon";

interface searchRequestProps {
  searchRequest: string;
  setSearchRequest: (word: string) => void;
  variant?: string;
  className?: string;
}

const Searchbar = forwardRef<HTMLInputElement, searchRequestProps>(
  (
    { searchRequest, setSearchRequest, variant = "desktop", className },
    ref,
  ) => {
    return (
      //todo: NOTE: mx- was 3, i dont remember why. Check on mobile responsive
      <div
        className={`
          h-full
          flex items-center flex-1
          mx- xl:mx-0 p-2
          rounded-xs
          bg-(--bg-secondary) border border-(--bg-border) hover:border-(--border-hover-btn) group ${className}
          select-none

          xl:h-10
          xl:px-5 xl:py-3 gap-2 `}
      >
        {variant === "desktop" ? <MagnifyIcon className="w-5 h-5" /> : null}

        {/* //TODO: add debounce after connetion to db */}

        <input
          ref={ref}
          type="text"
          placeholder="Найти..."
          className="w-full
          font-consolas text-(--text-primary) outline-none
          dark:group-hover:placeholder-(--text-primary) group-hover:placeholder-(--text-primary) placeholder-(--text-secondary)"
          value={searchRequest}
          onChange={(e) => setSearchRequest(e.target.value)}
        />
      </div>
    );
  },
);

export default Searchbar;
