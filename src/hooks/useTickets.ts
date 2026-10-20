import { useEffect, useRef, useState } from "react";
import type { Ticket } from "../types/ticket.types";
import { getTicketList } from "../api/requests";
import { isAbortError } from "../api/client";

export default function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const hasLoadedRef = useRef(false);

  function reload() {
    setReloadKey((k) => k + 1);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        if (!hasLoadedRef.current) {
          setIsLoading(true);
        }

        setError(null);
        const list = await getTicketList(controller.signal);
        setTickets(list);
        hasLoadedRef.current = true;
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

  return { tickets, setTickets, isLoading, error, reload };
}
