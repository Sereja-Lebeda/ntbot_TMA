import { useEffect, useState } from "react";
import type { CategoryDto } from "../api/api.types";
import { getCategoryList } from "../api/requests";
import { isAbortError } from "../api/client";

function useCategoryList() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  function reload() {
    setReloadKey((k) => k + 1);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const loadedCategories = await getCategoryList(controller.signal);
        setCategories(loadedCategories);
      } catch (e) {
        if (isAbortError(e)) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [reloadKey]);

  return { categories, isLoading, error, reload };
}

export default useCategoryList;
