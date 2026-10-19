import useMediaQuery from "../../hooks/useMediaQuery";
import useSectionNav from "../../hooks/useSectionNav";

import TicketIcon from "../../icons/header/TicketIcon";
import FooterBtn from "../ui/Buttons/FooterBtn";
import RatingIcon from "../../icons/header/RatingIcon";
import KnowledgeBaseIcon from "../../icons/header/KnowledgeBaseIcon";
import useIsTyping from "../../hooks/useIsTyping";

function MobileFooter() {
  const isDesktop = useMediaQuery("(min-width:1280px)");

  const isTyping = useIsTyping();
  const isTouch = useMediaQuery("(pointer: coarse)");

  const [activeSection, goToSection] = useSectionNav();
  if (!activeSection) return null;
  if (isDesktop) return null;
  if (isTyping && isTouch) return null;

  return (
    <div className="w-full pb-(--app-safe-bottom) bg-[#0e0e0e] border-t border-[#201e1e]">
      <div className="w-full h-20 flex justify-center items-center px-5 py-4 gap-10">
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
    </div>
  );
}

export default MobileFooter;
