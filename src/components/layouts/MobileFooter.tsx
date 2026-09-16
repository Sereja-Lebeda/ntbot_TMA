import { useLocation, useNavigate } from "react-router";
import useMediaQuery from "../../hooks/useMediaQuery";

import TicketIcon from "../../icons/header/TicketIcon";
import FooterBtn from "../ui/Buttons/FooterBtn";
import RatingIcon from "../../icons/header/RatingIcon";
import KnowledgeBaseIcon from "../../icons/header/KnowledgeBaseIcon";

function MobileFooter() {
  const isDesktop = useMediaQuery("(min-width:1280px)");

  const navigate = useNavigate();
  const location = useLocation();

  if (isDesktop) return null;

  const activeSection =
    location.pathname === "/"
      ? "tickets"
      : location.pathname === "/rating"
        ? "rating"
        : "knowledge";

  return (
    <div
      className="bottom-0
      fixed w-full h-20
  flex justify-center items-center
  px-5 py-4  gap-10 z-30
  bg-[#0e0e0e] border-t border-[#201e1e]
  
  "
    >
      <FooterBtn
        onClick={() => navigate("/")}
        icon={<TicketIcon activeSection={activeSection} />}
        text={"Заявки"}
        textClassName={`${activeSection === "tickets" ? "text-(--bg-btn-primary)" : "group-hover:text-[#ede8de] text-(--text-secondary)"}`}
      />
      <FooterBtn
        onClick={() => navigate("/rating")}
        icon={<RatingIcon activeSection={activeSection} />}
        text={"Статистика"}
        textClassName={`${activeSection === "rating" ? "text-(--bg-btn-primary)" : "group-hover:text-[#ede8de] text-(--text-secondary)"}`}
      />
      <FooterBtn
        onClick={() => navigate("/knowledge-base")}
        icon={<KnowledgeBaseIcon activeSection={activeSection} />}
        text={"Инструкции"}
        textClassName={`${activeSection === "knowledge" ? "text-(--bg-btn-primary)" : "group-hover:text-[#ede8de] text-(--text-secondary)"}`}
      />
    </div>
  );
}

export default MobileFooter;
