import { useEffect, useState } from "react";
import { getUser } from "../api/requests";
import type { UserType } from "../types/user.types";
import { isAbortError } from "../api/client";

function useUserLoader() {
  const [user, setUser] = useState<UserType | null>(null);

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
        const loadedUser = await getUser(controller.signal);
        setUser(loadedUser);
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

  return { user, isLoading, error, reload };
}

export default useUserLoader;
