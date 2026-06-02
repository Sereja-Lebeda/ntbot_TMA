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
  const textStyleAnimation =
    "cursor-pointer transition-all duration-200 ease-in-out hover:text-(--text-primary) active:opacity-0";
  console.log(isActive);
  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`w-10 h-10 flex justify-center items-center rounded-xs border dark:border-(--bg-border) ${isActive ? `dark:bg-(--bg-secondary) hover:border-(--border-hover-btn) select-none group ${className} ${textStyleAnimation}` : ` ${inactiveClassName} select-none ${className}`}`}
    >
      {icon}
    </div>
  );
}
