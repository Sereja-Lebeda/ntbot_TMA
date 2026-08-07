import type { activeSectionType } from "../../types/header.types";

import useMediaQuery from "../../hooks/useMediaQuery";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

interface HeaderProps {
  activeSection: activeSectionType;
  setActiveSection: (section: activeSectionType) => void;
  openSidebar: () => void;
}

export default function Header({
  activeSection,
  setActiveSection,
  openSidebar,
}: HeaderProps) {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  // const location = useLocation();
  // const isOnCreatePage = location.pathname === "/tickets/new";

  return (
    <>
      {isDesktop ? (
        <DesktopHeader
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      ) : (
        <MobileHeader openSidebar={openSidebar} />
      )}
    </>
  );
}
