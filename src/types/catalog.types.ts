// catalog.types.ts
import type { CatalogActionDto } from "../api/api.types";

export interface CatalogSubcategory {
  id: number;
  name: string;
  actions: CatalogActionDto[];
}
