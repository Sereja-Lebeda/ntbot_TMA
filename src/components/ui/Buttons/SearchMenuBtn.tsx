import { btnPressAnimationStyle } from "../../../styles/pressAnimation";
import { hapticTap } from "../../../utils/haptics";

interface SearchMenuBtnProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  // inactiveClassName?: string;
  isBtnDisabled?: boolean;
}

export default function SearchMenuBtn({
  icon,
  onClick,
  className,
  isActive = false,
  // inactiveClassName,
  isBtnDisabled = false,
}: SearchMenuBtnProps) {
  const bgClass = isBtnDisabled
    ? "bg-(--bg-disable-btn)"
    : isActive
      ? "bg-(--bg-secondary)"
      : "bg-(--bg-inactive-btn)";

  function handleClick() {
    if (isActive) {
      hapticTap();
    }
    onClick?.();
  }

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      onClick={isBtnDisabled ? undefined : handleClick}
      className={`w-10 h-10 flex justify-center items-center rounded-xs border border-(--bg-border) ${
        !isBtnDisabled && isActive
          ? `${bgClass} hover:border-(--border-hover-btn) select-none group ${className} ${btnPressAnimationStyle}`
          : `${bgClass} select-none ${className}`
      }`}
    >
      {icon}
    </div>
  );
}
