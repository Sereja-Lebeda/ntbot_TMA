import type { UserType } from "../types/user.types";
import type { StatusType, Ticket } from "../types/ticket.types";

import handleStatusSelect from "../utils/statusSelectedHelper";
import getStatusTitle from "../utils/statusNameHelper";

import mockUser from "../../mockUserInfo.json";
import mockTicket from "../../mockTicketInfo.json";
import ToggleBtn from "../components/ui/ToggleBtn";
import StatusInfoBtn from "./ui/StatusInfoBtn";

import IpIcon from "../icons/infoblock/IpIcon";
import PcIcon from "../icons/infoblock/PcIcon";
import AccessIcon from "../icons/infoblock/AccessIcon";
import TelegramIcon from "../icons/card/TelegramIcon";

interface InfoblockProps {
  ticketStatuses: string[];
  setTicketStatuses: (status: string[]) => void;
}

function Infoblock({ ticketStatuses, setTicketStatuses }: InfoblockProps) {
  const mock = mockUser as UserType;
  const allTickets = mockTicket;

  const baseStyle = "flex items-center px-0.5 gap-2";
  const textStyle =
    "font-consolas text-sm font-normal text-(--text-secondary) select-none";
  const textStyleAnimation =
    "cursor-pointer transition-all duration-600 ease-in-out hover:text-(--text-primary) active:opacity-0";

  const spans = [
    "col-span-2",
    "col-span-3",
    "col-span-3",
    "col-span-2",
    "col-span-2",
    "col-span-3",
  ];

  const plateHeights = ["h-28", "h-28", "h-25", "h-25", "h-18", "h-18"];
  const ticketStatusOrder = [
    "New",
    "In progress",
    "Complete",
    "Paused",
    "Cancelled",
    "Closed",
  ];

  function getTicketQuantity(ticketList: Ticket[]) {
    return ticketList.reduce(
      (acc: Record<string, number>, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  const ticketQuantities = getTicketQuantity(allTickets as Ticket[]);

  return (
    // Whole left side
    <div className="h-246 w-79 flex flex-col items-center my-3 gap-3">
      {/* Info block  */}
      <div className="h-223 w-full flex flex-col items-center p-5 pt-5 pb-90 border border-(--bg-border) bg-(--bg-primary-second) rounded-xs gap-3">
        {/* User Info */}
        <div className="w-69 flex flex-col justify-center items-start px-4 py-6 gap-3 border border-(--bg-border) bg-(--bg-tertiary) rounded-xs">
          {/* User name */}
          <div className="h-10 w-full flex items-center px-1 border-b border-[#1D1D1D]">
            <span className="font-jbmono text-(--text-primary) text-lg font-bold leading-5.5">
              {mock.name}
            </span>
          </div>

          {/* User pc Info */}
          <div className="w-full flex flex-col items-start gap-3.5">
            {/* user ip  */}
            <div className={baseStyle}>
              <IpIcon />
              {/* TODO: Make pretty hint about copy */}
              <span
                title="Стукни по мне"
                className={`${textStyle} ${textStyleAnimation}`}
                onClick={() => navigator.clipboard.writeText(mock.localIp)}
              >
                {mock.localIp}
              </span>
            </div>
            {/* pc name  */}
            <div className={baseStyle}>
              <div className="w-5 h-5 flex justify-center items-center">
                <PcIcon />
              </div>

              {/* TODO: Make pretty hint about copy */}
              <span
                className={`${textStyle} ${textStyleAnimation}`}
                onClick={() => navigator.clipboard.writeText(mock.localIp)}
              >
                {mock.pcName}
              </span>
            </div>
            {/* access date  */}
            <div className={baseStyle}>
              <div className="w-5 h-5 flex justify-center items-center bg-[#A1FF6226] rounded-xs">
                <AccessIcon />
              </div>
              <span className={textStyle}>
                Доступ до {mock.remoteAccessDate}
              </span>
            </div>
          </div>
        </div>

        {/* Status of tickets */}
        <div className="w-69 grid grid-cols-5 gap-2">
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

      {/* Toggle and telegram block  */}
      <div className="w-full h-full flex justify-center items-center p-5 bg-(--bg-primary-second) border border-(--bg-border) rounded-xs gap-2.5">
        <button className="flex items-center bg-(--bg-primary-second) border border-(--bg-border) rounded-xs p-2">
          <ToggleBtn />
        </button>
        <button className="w-full flex justify-center items-center px-3 py-2.5 bg-(--bg-primary-second) border border-(--bg-border) rounded-xs gap-2">
          <TelegramIcon />
          <span className="font-jbmono text-(--text-secondary) text-sm font-medium leading-normal select-none">
            Задать вопрос
          </span>
        </button>
      </div>
    </div>
  );
}

export default Infoblock;
