import useMediaQuery from "../hooks/useMediaQuery";

export function MobilePageOffset() {
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const mobilePageOffset = `${isDesktop ? "sticky" : "fixed top-15.5"} max-w-200 mx-auto`;

  return mobilePageOffset;
}
