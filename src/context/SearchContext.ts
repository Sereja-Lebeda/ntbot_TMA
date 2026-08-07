import { createContext } from "react";

interface SearchContextProps {
  searchRequest: string;
  setSearchRequest: (word: string) => void;
}

export const SearchContext = createContext<SearchContextProps | null>(null);
