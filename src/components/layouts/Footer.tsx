import useMediaQuery from "../../hooks/useMediaQuery";

import type { activeSectionType } from "../../types/header.types";

import TicketIcon from "../../icons/header/TicketIcon";
import FooterBtn from "../ui/Buttons/FooterBtn";
import RatingIcon from "../../icons/header/RatingIcon";
import KnowledgeBaseIcon from "../../icons/header/KnowledgeBaseIcon";

interface FooterProps {
  activeSection: activeSectionType;
  setActiveSection: (section: activeSectionType) => void;
}

function Footer({ activeSection, setActiveSection }: FooterProps) {
  const isDesktop = useMediaQuery("(min-width:1280px)");
  if (isDesktop) return null;

  return (
    <div
      className="bottom-0
      fixed w-full h-20
  flex justify-center items-center
  px-5 py-4  gap-10 z-20
  bg-[#0e0e0e] border-t border-[#201e1e]
  
  "
    >
      <FooterBtn
        onClick={() => setActiveSection("tickets")}
        icon={<TicketIcon activeSection={activeSection} />}
        text={"Заявки"}
        textClassName={`${activeSection === "tickets" ? "text-(--bg-btn-primary)" : "group-hover:text-[#ede8de] text-(--text-secondary)"}`}
      />
      <FooterBtn
        onClick={() => setActiveSection("rating")}
        icon={<RatingIcon activeSection={activeSection} />}
        text={"Статистика"}
        textClassName={`${activeSection === "rating" ? "text-(--bg-btn-primary)" : "group-hover:text-[#ede8de] text-(--text-secondary)"}`}
      />
      <FooterBtn
        onClick={() => setActiveSection("knowledge")}
        icon={<KnowledgeBaseIcon activeSection={activeSection} />}
        text={"Инструкции"}
        textClassName={`${activeSection === "knowledge" ? "text-(--bg-btn-primary)" : "group-hover:text-[#ede8de] text-(--text-secondary)"}`}
      />
    </div>
  );
}

export default Footer;
