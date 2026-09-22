import useMediaQuery from "../../hooks/useMediaQuery";
import useSectionNav from "../../hooks/useSectionNav";

import TicketIcon from "../../icons/header/TicketIcon";
import FooterBtn from "../ui/Buttons/FooterBtn";
import RatingIcon from "../../icons/header/RatingIcon";
import KnowledgeBaseIcon from "../../icons/header/KnowledgeBaseIcon";

function MobileFooter() {
  const isDesktop = useMediaQuery("(min-width:1280px)");

  const [activeSection, goToSection] = useSectionNav();
  if (!activeSection) return null;
  if (isDesktop) return null;

  return (
    <div
      className="w-full h-20
  flex justify-center items-center
  px-5 py-4  gap-10
  bg-[#0e0e0e] border-t border-[#201e1e]
  
  "
    >
      <FooterBtn
        onClick={() => goToSection("tickets")}
        icon={<TicketIcon activeSection={activeSection} />}
        text={"Заявки"}
        textClassName={`${activeSection === "tickets" ? "text-(--bg-btn-primary)" : "group-hover:text-[#ede8de] text-(--text-secondary)"}`}
      />
      <FooterBtn
        onClick={() => goToSection("rating")}
        icon={<RatingIcon activeSection={activeSection} />}
        text={"Статистика"}
        textClassName={`${activeSection === "rating" ? "text-(--bg-btn-primary)" : "group-hover:text-[#ede8de] text-(--text-secondary)"}`}
      />
      <FooterBtn
        onClick={() => goToSection("knowledge")}
        icon={<KnowledgeBaseIcon activeSection={activeSection} />}
        text={"Инструкции"}
        textClassName={`${activeSection === "knowledge" ? "text-(--bg-btn-primary)" : "group-hover:text-[#ede8de] text-(--text-secondary)"}`}
      />
    </div>
  );
}

export default MobileFooter;
