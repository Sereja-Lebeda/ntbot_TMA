import KnowledgeBaseIcon from "../../icons/header/KnowledgeBaseIcon";
import MascootIcon from "../../icons/header/MascootIcon";
import PlusIcon from "../../icons/header/PlusIcon";
import RatingIcon from "../../icons/header/RatingIcon";
import TicketIcon from "../../icons/header/TicketIcon";

export default function Header() {
  return (
    <div className="w-full h-18 bg-[#0e0e0e] border-b border-[#201e1e] flex justify-center items-center gap-2.5 px-8 py-7">
      <div className="w-225 flex justify-between items-center">
        {/* Mascoot icon and bot name - Left side*/}
        <div className="flex justify-center items-center gap-4">
          <MascootIcon />
          <p className="text-4xl font-jbmono font-extrabold leading-9 tracking-[1.6px] select-none">
            NTBot
          </p>
        </div>

        <div className="flex justify-center items-center gap-8">
          {/* Three icons - Right side */}
          <div className="flex justify-center items-center gap-4">
            <button className="cursor-pointer">
              <TicketIcon />
            </button>
            <button className="cursor-pointer">
              <RatingIcon />
            </button>
            <button className="cursor-pointer">
              <KnowledgeBaseIcon />
            </button>
          </div>

          <button className="h-10 w-47.5 bg-[#a1ff62] rounded-xs flex justify-center items-center px-6 py-3 gap-2 cursor-pointer">
            <div className="flex items-center gap-1">
              <PlusIcon className="w-5 h-5" />
              <p className="text-sm text-(--bg-primary-second) font-jbmono font-extrabold select-none">
                Создать заявку
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
