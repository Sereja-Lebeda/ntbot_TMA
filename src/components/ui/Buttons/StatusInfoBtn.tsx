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
    quantity: " xl:font-jbmono xl:text-[22px] xl:font-extralight xl:leading-7",
    statusLabel: "xl:text-sm xl:font-jbmono xl:font-normal xl:leading-5",
    container:
      "xl:flex xl:flex-col xl:items-center xl:h-full xl:justify-center xl:gap-1",
  },
  "In progress": {
    quantity: " xl:font-jbmono xl:text-[28px] xl:font-extralight xl:leading-9",
    statusLabel: "xl:text-base xl:font-jbmono xl:font-normal xl:leading-5.5",
    container: "xl:flex xl:items-baseline xl:gap-2",
  },
  Paused: {
    quantity: " xl:font-jbmono xl:text-[22px] xl:font-extralight xl:leading-7",
    statusLabel: "xl:text-sm xl:font-jbmono xl:font-normal xl:leading-5",
    container:
      "xl:flex xl:flex-col xl:items-center xl:h-full xl:justify-center xl:gap-1",
  },
  Complete: {
    quantity: "xl:text-[28px] font-jbmono font-extralight leading-9",
    statusLabel: "xl:text-base xl:font-jbmono xl:font-normal xl:leading-5.5",
    container: "xl:flex xl:items-baseline xl:gap-2",
  },
  Closed: {
    quantity: "xl:text-[22px] font-jbmono font-extralight leading-7",
    statusLabel: "xl:text-base xl:font-jbmono xl:font-normal xl:leading-5.5",
    container: "xl:flex xl:items-baseline xl:gap-2",
  },
  Cancelled: {
    quantity: "xl:text-lg xl:font-jbmono xl:font-extralight xl:leading-6.5",
    statusLabel: "xl:text-sm xl:font-jbmono xl:font-normal xl:leading-5",
    container:
      "xl:flex xl:flex-col xl:items-center xl:h-full xl:justify-center xl:gap-1",
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
      className={`${plateHeight} ${isSelected ? "xl:border-(--text-primary) " : "xl:border-(--bg-border) xl:hover:border-(--border-hover-btn)"} xl:bg-(--bg-primary-secondary) xl:border xl:rounded-xs xl:group`}
    >
      <div className="xl:flex xl:items-center xl:justify-center xl:h-full xl:select-none xl:cursor-pointer">
        <div
          className={`${textStyles[status].container} xl:hover:text-(--text-primary)`}
        >
          <div
            className={`${textStyles[status].quantity} ${isSelected ? "xl:text-(--text-primary)" : "xl:text-(--text-secondary) "} xl:group-hover:text-(--text-primary)`}
          >
            {quantity}
          </div>
          <div
            className={`${textStyles[status].statusLabel} ${isSelected ? "xl:text-(--text-primary)" : "xl:text-(--text-secondary)"} xl:group-hover:text-(--text-primary)`}
          >
            {getStatusTitle(status, "infoBlock")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusInfoBtn;
