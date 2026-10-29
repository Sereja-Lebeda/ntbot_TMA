import useCatalog from "./useCatalog";

function useCategoryList() {
  const { catalog, isLoading, error, reload } = useCatalog();

  return { categories: catalog, isLoading, error, reload };
}

export default useCategoryList;
