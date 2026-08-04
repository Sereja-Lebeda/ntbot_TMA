import { btnPressAnimationStyle } from "../../../styles/pressAnimation";

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
      className={`xl:w-10 xl:h-10 xl:flex xl:justify-center xl:items-center xl:rounded-xs xl:border xl:border-(--bg-border) ${isActive ? `xl:bg-(--bg-secondary) xl:hover:border-(--border-hover-btn) xl:select-none group ${className} ${btnPressAnimationStyle}` : ` ${inactiveClassName} xl:select-none ${className}`}`}
    >
      {icon}
    </div>
  );
}
