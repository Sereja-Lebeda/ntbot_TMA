import { useEffect, useState } from "react";

function useMediaQuery(query: string): boolean {
  const [media, setMedia] = useState(() => {
    return window.matchMedia(query).matches;
  });

  function handleChange(e: MediaQueryListEvent) {
    setMedia(e.matches);
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);
  return media;
}

export default useMediaQuery;
