import { useState } from "react";

import type { StatusType, Ticket } from "../types/ticket.types";
import { textPressAnimationStyle } from "../styles/pressAnimation";

import handleStatusSelect from "../utils/statusSelectedHelper";
import getTicketQuantity from "../utils/getTicketQuantity";
import getStatusTitle from "../utils/ticketBadgeHelpers";

import StatusInfoBtn from "./ui/Buttons/StatusInfoBtn";

import CopyHint from "../components/ui/CopyHint";
import SupportButtons from "./ui/Buttons/SupportButtons";
import IpIcon from "../icons/infoblock/IpIcon";
import PcIcon from "../icons/infoblock/PcIcon";
import AccessIcon from "../icons/infoblock/AccessIcon";
import useUser from "../hooks/useUser";
import displayOrDash from "../utils/displayOrDash";
import isEmptyValue from "../utils/isEmptyValue";

interface InfoblockProps {
  ticketStatuses: string[];
  setTicketStatuses: (status: string[]) => void;
  visibleTickets: Ticket[];
}

const STATUS_PLATE: Record<StatusType, { span: string; height: string }> = {
  New: { span: "col-span-2", height: "xl:h-28" },
  "In progress": { span: "col-span-3", height: "xl:h-28" },
  Pending: { span: "col-span-5", height: "xl:h-18" },
  Complete: { span: "col-span-3", height: "xl:h-25" },
  Paused: { span: "col-span-2", height: "xl:h-25" },
  Cancelled: { span: "col-span-2", height: "xl:h-18" },
  Closed: { span: "col-span-3", height: "xl:h-18" },
};

const STATUS_DISPLAY_ORDER: StatusType[] = [
  "New",
  "In progress",
  "Pending",
  "Complete",
  "Paused",
  "Cancelled",
  "Closed",
];

function Infoblock({
  ticketStatuses,
  setTicketStatuses,
  visibleTickets,
}: InfoblockProps) {
  const [copiedField, setCopiedField] = useState<"ip" | "pcName" | null>(null);

  const { user: currentUser, isLoading } = useUser();

  const baseStyle = "xl:w-full xl:flex xl:items-center xl:px-0.5 xl:gap-2";
  const textStyle =
    "xl:font-consolas xl:text-sm xl:font-normal xl:text-(--text-secondary) xl:select-none";

  // Style for hints near user info
  const copyHintBase =
    "xl:rounded-sm xl:ml-auto xl:px-1 xl:transition-opacity xl:duration-600 xl:ease-in-out";
  const copyHintIpAnimation = `${copyHintBase} ${copiedField === "ip" ? "xl:opacity-100" : "xl:opacity-0"} `;
  const copyHintPcNameAnimation = `${copyHintBase} ${copiedField === "pcName" ? "xl:opacity-100" : "xl:opacity-0"} `;

  const ticketQuantities = getTicketQuantity(visibleTickets);

  return (
    // Whole left side
    <div
      onMouseDown={(e) => e.preventDefault()}
      className="xl:h-full xl:w-79 xl:flex xl:flex-col xl:items-center xl:gap-3 xl:shrink-0"
    >
      {/* Info block  */}
      <div className="xl:min-h-0 xl:w-full xl:flex xl:flex-col xl:flex-1 xl:items-center xl:p-5 xl:pt-5 xl:border xl:border-(--bg-border) xl:bg-(--bg-primary-second) xl:rounded-xs xl:gap-3 xl:overflow-y-auto xl:overflow-x-hidden scrollbar-gutter-stable dropdown-scroll">
        {/* User Info */}
        <div className="xl:w-69 xl:flex xl:flex-col xl:justify-center xl:items-start xl:px-4 xl:py-6 xl:gap-3 xl:border xl:border-(--bg-border) xl:bg-(--bg-tertiary) xl:rounded-xs xl:select-none">
          {/* User name */}
          {currentUser ? (
            <>
              <div className="xl:h-10 xl:w-full xl:flex xl:items-center xl:px-1 xl:border-b xl:border-(--bg-disable-btn)">
                <span className="xl:font-jbmono xl:text-(--text-primary) xl:text-lg xl:font-bold xl:leading-5.5 xl:mb-6">
                  {currentUser.name}
                </span>
              </div>
              {/* User pc Info */}
              <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:gap-3.5">
                {/* user ip  */}
                <div
                  onClick={() => {
                    if (isEmptyValue(currentUser.localIp)) return;
                    navigator.clipboard.writeText(currentUser.localIp);
                    setCopiedField("ip");
                    setTimeout(() => setCopiedField(null), 1000);
                  }}
                  className={`${baseStyle} ${isEmptyValue(currentUser.localIp) ? "" : "cursor-pointer"}`}
                >
                  <IpIcon />
                  <span
                    className={`${textStyle} ${isEmptyValue(currentUser.localIp) ? "" : textPressAnimationStyle}`}
                  >
                    {displayOrDash(currentUser.localIp)}
                  </span>
                  <span className={`${copyHintIpAnimation}`}>
                    <CopyHint />
                  </span>
                </div>
                {/* pc name  */}
                <div
                  onClick={() => {
                    if (isEmptyValue(currentUser.pcName)) return;
                    navigator.clipboard.writeText(currentUser.pcName);
                    setCopiedField("pcName");
                    setTimeout(() => setCopiedField(null), 1000);
                  }}
                  className={`${baseStyle} ${isEmptyValue(currentUser.pcName) ? "" : "cursor-pointer"}`}
                >
                  <div className="xl:w-5 xl:h-5 xl:flex xl:justify-center xl:items-center">
                    <PcIcon />
                  </div>

                  <span
                    className={`${textStyle} ${isEmptyValue(currentUser.pcName) ? "" : textPressAnimationStyle}`}
                  >
                    {displayOrDash(currentUser.pcName)}
                  </span>
                  <span className={`${copyHintPcNameAnimation}`}>
                    <CopyHint />
                  </span>
                </div>
                {/* access date  */}
                <div className={baseStyle}>
                  <div className="xl:w-5 xl:h-5 xl:flex xl:justify-center xl:items-center xl:dark:bg-[#A1FF6226] xl:bg-[#71C13B40] xl:rounded-xs">
                    <AccessIcon className="xl:text-(--bg-task-complete) xl:dark:text-(--bg-btn-primary)" />
                  </div>
                  <span className={textStyle}>
                    Доступ до {displayOrDash(currentUser.remoteAccessDate)}
                  </span>
                </div>
              </div>
            </>
          ) : isLoading ? (
            <span
              className={`w-full h-full 
                flex justify-center items-center
              ${textStyle}`}
            >
              Загрузка...
            </span>
          ) : (
            <span
              className={`w-full h-full 
                flex justify-center items-center
                font-extrabold! text-(--bg-task-error)!
              ${textStyle}`}
            >
              Не удалось загрузить данные
            </span>
          )}
        </div>

        {/* Status of tickets */}
        <div className="xl:w-69 xl:grid xl:grid-cols-5 xl:gap-2">
          {STATUS_DISPLAY_ORDER.map((status) => (
            <div key={status} className={STATUS_PLATE[status].span}>
              <StatusInfoBtn
                quantity={ticketQuantities[status]}
                status={status}
                plateHeight={STATUS_PLATE[status].height}
                selectedItems={ticketStatuses}
                onClick={() =>
                  handleStatusSelect({
                    item: getStatusTitle(status, "statusBlock"),
                    selectedItems: ticketStatuses,
                    setSelectedItems: setTicketStatuses,
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* // Toggle and telegram block */}
      <div className="xl:w-full xl:h-auto xl:flex xl:justify-center xl:items-center xl:p-5 xl:bg-(--bg-primary-second) xl:border xl:border-(--bg-border) xl:rounded-xs xl:gap-2.5">
        <SupportButtons />
      </div>
    </div>
  );
}

export default Infoblock;
