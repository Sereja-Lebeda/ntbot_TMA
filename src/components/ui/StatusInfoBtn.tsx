import getStatusTitle from "../../utils/ticketBadgeHelpers";

import type { StatusType } from "../../types/ticket.types";

interface StatusInfoBtnProps {
  quantity: number;
  status: StatusType;
  plateHeight: string;
  onClick: () => void;
  selectedItems: string[];
}

const textStyles = {
  New: {
    quantity: " font-jbmono text-[22px] font-extralight leading-7",
    statusLabel: "text-sm font-jbmono font-normal leading-5",
    container: "flex flex-col items-center h-full justify-center gap-1",
  },
  "In progress": {
    quantity: " font-jbmono text-[28px] font-extralight leading-9",
    statusLabel: "text-base font-jbmono font-normal leading-5.5",
    container: "flex items-baseline gap-2",
  },
  Paused: {
    quantity: " font-jbmono text-[22px] font-extralight leading-7",
    statusLabel: "text-sm font-jbmono font-normal leading-5",
    container: "flex flex-col items-center h-full justify-center gap-1",
  },
  Complete: {
    quantity: "text-[28px] font-jbmono font-extralight leading-9",
    statusLabel: "text-base font-jbmono font-normal leading-5.5",
    container: "flex items-baseline gap-2",
  },
  Closed: {
    quantity: "text-[22px] font-jbmono font-extralight leading-7",
    statusLabel: "text-base font-jbmono font-normal leading-5.5",
    container: "flex items-baseline gap-2",
  },
  Cancelled: {
    quantity: "text-lg font-jbmono font-extralight leading-6.5",
    statusLabel: "text-sm font-jbmono font-normal leading-5",
    container: "flex flex-col items-center h-full justify-center gap-1",
  },
};

function StatusInfoBtn({
  quantity,
  status,
  plateHeight,
  selectedItems,
  onClick,
}: StatusInfoBtnProps) {
  const isSelected = selectedItems.includes(
    getStatusTitle(status, "statusBlock"),
  );
  return (
    <div
      onClick={onClick}
      className={`${plateHeight} ${isSelected ? "border-(--text-primary) " : "border-(--bg-border) hover:border-(--border-hover-btn)"} bg-(--bg-primary-secondary) border rounded-xs group`}
    >
      <div className="flex items-center justify-center h-full select-none cursor-pointer ">
        <div
          className={`${textStyles[status].container} hover:text-(--text-primary)`}
        >
          <div
            className={`${textStyles[status].quantity} ${isSelected ? "text-(--text-primary)" : "text-(--text-secondary) "} group-hover:text-(--text-primary)`}
          >
            {quantity}
          </div>
          <div
            className={`${textStyles[status].statusLabel} ${isSelected ? "text-(--text-primary)" : "text-(--text-secondary)"} group-hover:text-(--text-primary)`}
          >
            {getStatusTitle(status, "infoBlock")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusInfoBtn;
