import { useNavigate, useLocation } from "react-router";

import FunctionBtn from "../ui/Buttons/FunctionBtn";

import { shadowLiftButtonStyle } from "../../styles/shadowLift";

import KnowledgeBaseIcon from "../../icons/header/KnowledgeBaseIcon";
import MascootIcon from "../../icons/header/MascootIcon";
import PlusIcon from "../../icons/header/PlusIcon";
import RatingIcon from "../../icons/header/RatingIcon";
import TicketIcon from "../../icons/header/TicketIcon";

export default function DesktopHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnCreatePage = location.pathname === "/tickets/new";
  const isOnMainPage = location.pathname === "/";

  const activeSection = isOnMainPage
    ? "tickets"
    : location.pathname === "/rating"
      ? "rating"
      : "knowledge";

  return (
    <div className="xl:max-w-389 xl:mx-auto xl:w-full xl:h-18 xl:bg-[#0e0e0e] xl:border-b xl:border-x xl:border-[#201e1e] xl:flex xl:justify-center xl:items-center xl:gap-2.5 xl:px-8 xl:py-7">
      <div className="xl:w-225 xl:flex xl:justify-between xl:items-center">
        {/* Mascoot icon and bot name - Left side*/}
        <div
          className="xl:flex xl:justify-center xl:items-center xl:gap-4 xl:cursor-pointer"
          onClick={() => navigate("/")}
        >
          <MascootIcon />
          <p className="xl:text-4xl xl:font-jbmono xl:font-extrabold xl:leading-9 xl:tracking-[1.6px] xl:select-none">
            NTBot
          </p>
        </div>

        <div className="xl:flex xl:justify-center xl:items-center xl:gap-8">
          {/* Three icons - Right side */}
          <div className="xl:flex xl:justify-center xl:items-center xl:gap-4">
            <button className="xl:cursor-pointer">
              <TicketIcon
                activeSection={activeSection}
                onClick={() => navigate("/")}
              />
            </button>
            <button className="xl:cursor-pointer">
              <RatingIcon
                activeSection={activeSection}
                onClick={() => navigate("/rating")}
              />
            </button>
            <button className="xl:cursor-pointer">
              <KnowledgeBaseIcon
                activeSection={activeSection}
                onClick={() => navigate("/knowledge-base")}
              />
            </button>
          </div>

          <FunctionBtn
            Icon={PlusIcon}
            iconClassName={"xl:w-5 xl:h-5"}
            text={"Создать заявку"}
            textClassName={
              "xl:text-sm xl:dark:text-(--bg-primary) xl:text-(--text-primary) xl:font-jbmono xl:font-extrabold xl:select-none"
            }
            btnClassName={`xl:h-10 xl:w-47.5 xl:rounded-xs xl:flex xl:justify-center xl:items-center xl:px-6 xl:py-3 xl:gap-2
              ${shadowLiftButtonStyle}
              xl:enabled:bg-(--bg-btn-primary)`}
            innerDivClassName={"xl:flex xl:items-center xl:gap-1"}
            onClick={() => navigate("/tickets/new")}
            disabled={isOnCreatePage || !isOnMainPage}
          />
        </div>
      </div>
    </div>
  );
}
