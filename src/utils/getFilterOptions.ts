import type { Ticket } from "../types/ticket.types";

function getFilterOptions(tickets: Ticket[]) {
  function withAllOption(values: (string | undefined)[]): string[] {
    const uniqueValues = new Set(
      values.filter((value): value is string => !!value),
    );
    return ["Все", ...uniqueValues];
  }

  const categories = withAllOption(
    tickets.map((ticket) => ticket.breadcrumbs[0]),
  );

  const departments = withAllOption(tickets.map((ticket) => ticket.department));

  const usernames = withAllOption(tickets.map((ticket) => ticket.userName));

  return { categories, departments, usernames };
}

export default getFilterOptions;
