import type { activeSectionType } from "../../types/header.types";
import { useNavigate, useLocation } from "react-router";

import KnowledgeBaseIcon from "../../icons/header/KnowledgeBaseIcon";
import MascootIcon from "../../icons/header/MascootIcon";
import PlusIcon from "../../icons/header/PlusIcon";
import RatingIcon from "../../icons/header/RatingIcon";
import TicketIcon from "../../icons/header/TicketIcon";

interface HeaderProps {
  activeSection: activeSectionType;
  setActiveSection: (section: activeSectionType) => void;
}

export default function Header({
  activeSection,
  setActiveSection,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnCreatePage = location.pathname === "/tickets/new";

  return (
    <div className="w-full h-18 bg-[#0e0e0e] border-b border-[#201e1e] flex justify-center items-center gap-2.5 px-8 py-7">
      <div className="w-225 flex justify-between items-center">
        {/* Mascoot icon and bot name - Left side*/}
        <div
          className="flex justify-center items-center gap-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <MascootIcon />
          <p className="text-4xl font-jbmono font-extrabold leading-9 tracking-[1.6px] select-none">
            NTBot
          </p>
        </div>

        <div className="flex justify-center items-center gap-8">
          {/* Three icons - Right side */}
          <div className="flex justify-center items-center gap-4">
            <button className="cursor-pointer">
              <TicketIcon
                activeSection={activeSection}
                // setActiveSection={setActiveSection}
                onClick={() => setActiveSection("tickets")}
              />
            </button>
            <button className="cursor-pointer">
              <RatingIcon
                activeSection={activeSection}
                // setActiveSection={setActiveSection}
                onClick={() => setActiveSection("rating")}
              />
            </button>
            <button className="cursor-pointer">
              <KnowledgeBaseIcon
                activeSection={activeSection}
                // setActiveSection={setActiveSection}
                onClick={() => setActiveSection("knowledge")}
              />
            </button>
          </div>

          <div
            className={`h-10 w-47.5 ${isOnCreatePage ? "bg-(--bg-disable-btn)" : "bg-[#ede8de] cursor-pointer"} rounded-xs select-none`}
          >
            <button
              disabled={isOnCreatePage}
              onClick={() => navigate("/tickets/new")}
              className="h-10 w-47.5 bg-(--bg-btn-primary) rounded-xs flex justify-center items-center px-6 py-3 gap-2 cursor-pointer
              transition-all duration-600 ease-in-out enabled:hover:-translate-x-1 enabled:hover:-translate-y-1 enabled:hover:z-10
            disabled:bg-(--bg-disable-btn)"
            >
              <div className="flex items-center gap-1">
                <PlusIcon className="w-5 h-5" />
                <span className="text-sm dark:text-(--bg-primary) text-(--text-primary) font-jbmono font-extrabold select-none">
                  Создать заявку
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
