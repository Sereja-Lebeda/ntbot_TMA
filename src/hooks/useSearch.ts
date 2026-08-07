import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

function useSearch() {
  const search = useContext(SearchContext);
  if (!search) {
    throw new Error(
      "Search Context called outside of wrapped by provider tree",
    );
  }
  return search;
}

export default useSearch;
