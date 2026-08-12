import getStatusTitle from "../../../utils/ticketBadgeHelpers";

import type { StatusType } from "../../../types/ticket.types";

interface StatusInfoBtnProps {
  quantity: number;
  status: StatusType;
  plateHeight: string;
  onClick: () => void;
  selectedItems: string[];
}

const textStyles = {
  New: {
    quantity:
      " font-jbmono text-sm xl:text-[22px] font-normal xl:font-extralight leading-5 xl:leading-7",
    statusLabel:
      "text-sm font-consolas xl:font-jbmono font-normal leading-3 xl:leading-5",
    container: "flex flex-col items-center h-full justify-center gap-1",
  },
  "In progress": {
    quantity:
      " font-jbmono text-sm xl:text-[28px] font-normal xl:font-extralight leading-5  xl:leading-9",
    statusLabel:
      "text-sm xl:text-base font-consolas xl:font-jbmono font-normal leading-3 xl:leading-5.5",
    container:
      "flex flex-col items-center justify-center gap-1 xl:flex xl:flex-row xl:items-baseline xl:gap-2",
  },
  Paused: {
    quantity:
      " font-jbmono text-sm xl:text-[22px] font-normal xl:font-extralight leading-5  xl:leading-7",
    statusLabel:
      "text-sm font-consolas xl:font-jbmono font-normal leading-3 xl:leading-5",
    container: "flex flex-col items-center xl:h-full justify-center gap-1",
  },
  Complete: {
    quantity:
      " font-jbmono text-sm xl:text-[28px] font-normal xl:font-extralight leading-5  xl:leading-9",
    statusLabel:
      "text-sm xl:text-base font-consolas xl:font-jbmono font-normal leading-3 xl:leading-5.5",
    container:
      "flex flex-col xl:flex-row justify-center items-center gap-1 xl:items-baseline xl:gap-2",
  },
  Closed: {
    quantity:
      "font-jbmono text-sm xl:text-[22px] font-normal xl:font-extralight leading-5  xl:leading-7",
    statusLabel:
      "text-sm xl:text-base font-consolas xl:font-jbmono font-normal leading-3 xl:leading-5.5",
    container:
      "flex flex-col xl:flex-row justify-center items-center gap-1 xl:items-baseline xl:gap-2",
  },
  Cancelled: {
    quantity:
      "font-jbmono text-sm xl:text-lg font-normal xl:font-extralight leading-5  xl:leading-6.5",
    statusLabel:
      "text-sm font-consolas xl:font-jbmono font-normal leading-3 xl:leading-5",
    container: "flex flex-col items-center xl:h-full justify-center gap-1",
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
      className={`${plateHeight} ${isSelected ? "border-(--bg-border) xl:border-(--text-primary)" : "border-(--bg-border) hover:border-(--border-hover-btn)"} bg-(--bg-primary-second) border rounded-xs group`}
    >
      <div className="flex items-center justify-center h-full select-none cursor-pointer">
        <div
          className={`${textStyles[status].container} hover:text-(--text-primary)`}
        >
          <div
            className={`${textStyles[status].quantity} ${isSelected ? "text-(--text-primary)" : "text-(--text-primary) xl:text-(--text-secondary) "} group-hover:text-(--text-primary)`}
          >
            {quantity}
          </div>
          <div
            className={`${textStyles[status].statusLabel} ${isSelected ? "text-(--bg-btn-primary) xl:text-(--text-primary)" : "text-(--text-secondary)"} group-hover:text-(--text-primary)`}
          >
            {getStatusTitle(status, "infoBlock")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusInfoBtn;
