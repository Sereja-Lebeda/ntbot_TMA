import { forwardRef } from "react";

import MagnifyIcon from "../../icons/searchmenu/MagnifyIcon";

interface searchRequestProps {
  searchRequest: string;
  setSearchRequest: (word: string) => void;
}

const Searchbar = forwardRef<HTMLInputElement, searchRequestProps>(
  ({ searchRequest, setSearchRequest }, ref) => {
    return (
      <div
        // onMouseDown={(e) => e.preventDefault()}
        className="h-10 flex items-center flex-1 px-5 py-3 gap-2 rounded-xs bg-(--bg-secondary) border border-(--bg-border) hover:border-(--border-hover-btn) group"
      >
        <MagnifyIcon className="w-5 h-5 " />
        {/* TODO: add debounce */}

        <input
          ref={ref}
          type="text"
          placeholder="Найти..."
          className="w-full font-consolas outline-none
          dark:group-hover:placeholder-(--text-primary)
          group-hover:placeholder-(--text-primary)
          placeholder-(--text-secondary) text-(--text-primary)"
          value={searchRequest}
          onChange={(e) => setSearchRequest(e.target.value)}
        />
      </div>
    );
  },
);

export default Searchbar;
