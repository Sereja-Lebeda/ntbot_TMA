import MagnifyIcon from "../../icons/searchmenu/MagnifyIcon";

interface searchRequestProps {
  searchRequest: string;
  setSearchRequest: (word: string) => void;
}

export default function Searchbar({
  searchRequest,
  setSearchRequest,
}: searchRequestProps) {
  return (
    <div
      // onMouseDown={(e) => e.preventDefault()}
      className="h-10 flex items-center flex-1 px-5 py-3 gap-2 rounded-xs border border-(--bg-border)"
    >
      <MagnifyIcon className="w-5 h-5" />
      {/* TODO: использовать useRef на input и программно управлять фокусом. */}
      <input
        type="text"
        placeholder="Найти..."
        className="w-full font-consolas outline-none"
        value={searchRequest}
        onChange={(e) => setSearchRequest(e.target.value)}
      />
    </div>
  );
}
