import { useState } from "react";
import { SearchContext } from "../context/SearchContext";

interface SearchProviderProps {
  children: React.ReactNode;
}

function SearchProvider({ children }: SearchProviderProps) {
  const [searchRequest, setSearchRequest] = useState("");

  return (
    <SearchContext.Provider value={{ searchRequest, setSearchRequest }}>
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider;
