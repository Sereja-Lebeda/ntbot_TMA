import useMediaQuery from "./useMediaQuery";

function useIsTablet() {
  return useMediaQuery("(min-width: 501px) and (max-width: 1279px)");
}

export default useIsTablet;
