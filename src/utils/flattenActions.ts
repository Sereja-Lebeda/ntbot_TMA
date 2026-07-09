// utils/flattenActions.ts
import type { CategoryNode, Action } from "../types/createTicket.type";

export default function flattenActions(categories: CategoryNode[]): Action[] {
  return categories.flatMap((category) =>
    category.subcategories.flatMap((subcategory) => subcategory.actions),
  );
}
