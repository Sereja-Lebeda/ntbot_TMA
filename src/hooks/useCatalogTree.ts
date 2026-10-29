import { hasForm } from "../api/mappers";
import useCatalog from "./useCatalog";

function useCatalogTree(categoryId: number | undefined) {
  const { catalog, isLoading, error, reload } = useCatalog();

  const category = catalog.find((cat) => cat.category_id === categoryId);

  const tree = (category?.subcategories ?? []).map((sub) => ({
    id: sub.subcategory_id,
    name: sub.name,
    actions: (sub.actions ?? []).filter(hasForm),
  }));

  return { tree, isLoading, error, reload };
}

export default useCatalogTree;
