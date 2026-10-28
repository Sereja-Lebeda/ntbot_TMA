// catalog.types.ts
import type { ActionListItemDto } from "../api/api.types";

export interface CatalogSubcategory {
  id: number;
  name: string;
  actions: ActionListItemDto[];
}
