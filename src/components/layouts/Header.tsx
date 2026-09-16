import useMediaQuery from "../../hooks/useMediaQuery";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

interface HeaderProps {
  openSidebar: () => void;
}

export default function Header({ openSidebar }: HeaderProps) {
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  return (
    <>
      {isDesktop ? (
        <DesktopHeader />
      ) : (
        <MobileHeader openSidebar={openSidebar} />
      )}
    </>
  );
}
