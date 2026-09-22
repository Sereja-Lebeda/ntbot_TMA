import { useState } from "react";

import type { UserType } from "../types/user.types";
import type { StatusType, Ticket } from "../types/ticket.types";
import { textPressAnimationStyle } from "../styles/pressAnimation";

import handleStatusSelect from "../utils/statusSelectedHelper";
import getTicketQuantity from "../utils/getTicketQuantity";
import getStatusTitle, { allStatuses } from "../utils/ticketBadgeHelpers";

import mockUser from "../../mockUserInfo.json";
import mockTicket from "../../mockTicketInfo.json";
import StatusInfoBtn from "./ui/Buttons/StatusInfoBtn";

import CopyHint from "../components/ui/CopyHint";
import SupportButtons from "./ui/Buttons/SupportButtons";
import IpIcon from "../icons/infoblock/IpIcon";
import PcIcon from "../icons/infoblock/PcIcon";
import AccessIcon from "../icons/infoblock/AccessIcon";

interface InfoblockProps {
  ticketStatuses: string[];
  setTicketStatuses: (status: string[]) => void;
  ticketView: string;
}

function Infoblock({
  ticketStatuses,
  setTicketStatuses,
  ticketView,
}: InfoblockProps) {
  const [copiedField, setCopiedField] = useState<"ip" | "pcName" | null>(null);

  const mockUserInfo = mockUser as UserType;
  const allTickets = mockTicket;

  const baseStyle = "xl:w-full xl:flex xl:items-center xl:px-0.5 xl:gap-2";
  const textStyle =
    "xl:font-consolas xl:text-sm xl:font-normal xl:text-(--text-secondary) xl:select-none";

  // Style for hints near user info
  const copyHintBase =
    "xl:rounded-sm xl:ml-auto xl:px-1 xl:transition-opacity xl:duration-600 xl:ease-in-out";
  const copyHintIpAnimation = `${copyHintBase} ${copiedField === "ip" ? "xl:opacity-100" : "xl:opacity-0"} `;
  const copyHintPcNameAnimation = `${copyHintBase} ${copiedField === "pcName" ? "xl:opacity-100" : "xl:opacity-0"} `;

  const spans = [
    "col-span-2",
    "col-span-3",
    "col-span-3",
    "col-span-2",
    "col-span-2",
    "col-span-3",
  ];

  const plateHeights = [
    "xl:h-28",
    "xl:h-28",
    "xl:h-25",
    "xl:h-25",
    "xl:h-18",
    "xl:h-18",
  ];
  const ticketStatusOrder = allStatuses;

  const currentUserId = mockUserInfo.id;
  const filteredTicketQuantities = allTickets.filter((ticket) => {
    return ticketView === "my"
      ? ticket.userId === currentUserId
      : ticket.userId !== currentUserId;
  });
  const ticketQuantities = getTicketQuantity(
    filteredTicketQuantities as unknown as Ticket[],
  );

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
          <div className="xl:h-10 xl:w-full xl:flex xl:items-center xl:px-1 xl:border-b xl:border-(--bg-disable-btn)">
            <span className="xl:font-jbmono xl:text-(--text-primary) xl:text-lg xl:font-bold xl:leading-5.5 xl:mb-6">
              {mockUserInfo.name}
            </span>
          </div>

          {/* User pc Info */}
          <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:gap-3.5">
            {/* user ip  */}
            <div
              onClick={() => {
                navigator.clipboard.writeText(mockUserInfo.localIp);
                setCopiedField("ip");
                setTimeout(() => setCopiedField(null), 1000);
              }}
              className={`${baseStyle} cursor-pointer`}
            >
              <IpIcon />
              <span className={`${textStyle} ${textPressAnimationStyle} `}>
                {mockUserInfo.localIp}
              </span>
              <span className={`${copyHintIpAnimation}`}>
                <CopyHint />
              </span>
            </div>
            {/* pc name  */}
            <div
              onClick={() => {
                navigator.clipboard.writeText(mockUserInfo.pcName);
                setCopiedField("pcName");
                setTimeout(() => setCopiedField(null), 1000);
              }}
              className={`${baseStyle} cursor-pointer`}
            >
              <div className="xl:w-5 xl:h-5 xl:flex xl:justify-center xl:items-center">
                <PcIcon />
              </div>

              <span className={`${textStyle} ${textPressAnimationStyle}`}>
                {mockUserInfo.pcName}
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
              {/* //TODO: Add ternar for access  */}
              <span className={textStyle}>
                Доступ до {mockUserInfo.remoteAccessDate}
              </span>
            </div>
          </div>
        </div>

        {/* Status of tickets */}
        <div className="xl:w-69 xl:grid xl:grid-cols-5 xl:gap-2">
          {ticketStatusOrder.map((status, index) => (
            <div key={status} className={`${spans[index]}`}>
              <StatusInfoBtn
                quantity={ticketQuantities[status]}
                status={status as StatusType}
                plateHeight={plateHeights[index]}
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
