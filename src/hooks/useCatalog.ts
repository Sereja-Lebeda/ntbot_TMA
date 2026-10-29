import { useEffect, useState } from "react";
import type { CatalogCategoryDto } from "../api/api.types";
import { getCatalog } from "../api/requests";

function useCatalog() {
  const [catalog, setCatalog] = useState<CatalogCategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  function reload() {
    setReloadKey((k) => k + 1);
  }

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const loadedCatalog = await getCatalog();
        if (isCancelled) return;
        setCatalog(loadedCatalog);
      } catch (e) {
        if (isCancelled) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      isCancelled = true;
    };
  }, [reloadKey]);

  return { catalog, isLoading, error, reload };
}

export default useCatalog;
