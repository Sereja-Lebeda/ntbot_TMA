import { useEffect, useState } from "react";
import type { CatalogSubcategory } from "../types/catalog.types";
import { getCatalogTree } from "../api/requests";
import { isAbortError } from "../api/client";

function useCatalogTree(categoryId: number | undefined) {
  const [tree, setTree] = useState<CatalogSubcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  function reload() {
    setReloadKey((k) => k + 1);
  }

  useEffect(() => {
    const controller = new AbortController();

    if (categoryId === undefined) return;
    async function load(categoryId: number) {
      try {
        setIsLoading(true);
        setError(null);
        const loadedTree = await getCatalogTree(categoryId, controller.signal);
        setTree(loadedTree);
      } catch (e) {
        if (isAbortError(e)) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    load(categoryId);
    return () => controller.abort();
  }, [categoryId, reloadKey]);

  return { tree, isLoading, error, reload };
}

export default useCatalogTree;
