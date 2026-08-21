import CrossIcon from "../../../icons/card/CrossIcon";
import {
  hoverAnimationStyle,
  btnPressAnimationStyle,
} from "../../../styles/pressAnimation";

interface MobileFileCardProps {
  name: string;
  dateLabel: string;
  onDelete?: () => void;
}

function MobileFileCard({
  name,

  dateLabel,
  onDelete,
}: MobileFileCardProps) {
  return (
    <div
      className={`w-full h-auto flex flex-col items-start border-[0.8px] border-(--bg-border) rounded-xs group shrink-0
        group
    ${hoverAnimationStyle} hover:border-(--border-hover-btn)`}
    >
      <div
        className={`w-full h-auto px-3 py-1 gap-2.5 flex justify-center items-center font-consolas font-normal
          
        `}
      >
        <span
          className={`w-full h-full flex flex-1
        text-xs text-(--text-primary) leading-3 truncate
        group-hover:text-(--text-primary)
        ${hoverAnimationStyle}`}
        >
          {name}
        </span>
        <span
          className={`h-full flex justify-center items-center text-[11px] text-(--text-secondary) leading-4 text-nowrap
        group-hover:text-(--text-primary)
        ${hoverAnimationStyle}`}
        >
          {dateLabel}
        </span>

        {onDelete && (
          <div
            onClick={onDelete}
            className="w-10 h-5 flex justify-center items-center bg-(--bg-secondary) rounded-xs group/delete cursor-pointer"
          >
            <CrossIcon
              className={`w-2.5 h-2.5 text-(--text-secondary) group-hover/delete:text-(--text-primary) ${btnPressAnimationStyle}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileFileCard;
