import { useLocation, useNavigate } from "react-router";

const sectionPath = {
  tickets: "/",
  rating: "/rating",
  knowledge: "/knowledge-base",
};

type SectionKey = keyof typeof sectionPath;

function useSectionNav(): [
  SectionKey | undefined,
  (section: SectionKey) => void,
] {
  const location = useLocation();
  const navigate = useNavigate();

  const activeSection: SectionKey | undefined =
    location.pathname === sectionPath.tickets
      ? "tickets"
      : location.pathname === sectionPath.rating
        ? "rating"
        : location.pathname === sectionPath.knowledge
          ? "knowledge"
          : undefined;

  function goToSection(section: SectionKey) {
    navigate(sectionPath[section]);
  }

  return [activeSection, goToSection];
}

export default useSectionNav;
