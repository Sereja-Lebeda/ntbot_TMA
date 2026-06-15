import { btnPressAnimationStyle } from "../../styles/pressAnimation";

interface SearchMenuBtnProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  inactiveClassName?: string;
}

export default function SearchMenuBtn({
  icon,
  onClick,
  className,
  isActive = false,
  inactiveClassName,
}: SearchMenuBtnProps) {
  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`w-10 h-10 flex justify-center items-center rounded-xs border border-(--bg-border) ${isActive ? `bg-(--bg-secondary) hover:border-(--border-hover-btn) select-none group ${className} ${btnPressAnimationStyle}` : ` ${inactiveClassName} select-none ${className}`}`}
    >
      {icon}
    </div>
  );
}
