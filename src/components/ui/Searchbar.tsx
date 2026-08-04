import { forwardRef } from "react";

import MagnifyIcon from "../../icons/searchmenu/MagnifyIcon";

interface searchRequestProps {
  searchRequest: string;
  setSearchRequest: (word: string) => void;
  className?: string;
}

const Searchbar = forwardRef<HTMLInputElement, searchRequestProps>(
  ({ searchRequest, setSearchRequest, className }, ref) => {
    return (
      <div
        // onMouseDown={(e) => e.preventDefault()}
        // onFocus={() => console.log("focus", document.activeElement)}
        className={`xl:h-10 xl:flex xl:items-center xl:flex-1 xl:px-5 xl:py-3 xl:gap-2 xl:rounded-xs xl:bg-(--bg-secondary) xl:border xl:border-(--bg-border) xl:hover:border-(--border-hover-btn) xl:group ${className} xl:select-none`}
      >
        <MagnifyIcon className="xl:w-5 xl:h-5" />
        {/* //TODO: add debounce after connetion to db */}

        <input
          ref={ref}
          type="text"
          placeholder="Найти..."
          className="xl:w-full xl:font-consolas xl:outline-none xl:dark:group-hover:placeholder-(--text-primary) xl:group-hover:placeholder-(--text-primary) xl:placeholder-(--text-secondary) xl:text-(--text-primary)"
          value={searchRequest}
          onChange={(e) => setSearchRequest(e.target.value)}
        />
      </div>
    );
  },
);

export default Searchbar;
