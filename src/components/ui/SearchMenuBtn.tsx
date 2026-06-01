interface SearchMenuBtnProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function SearchMenuBtn({
  icon,
  onClick,
  className,
}: SearchMenuBtnProps) {
  const textStyleAnimation =
    "cursor-pointer transition-all duration-200 ease-in-out hover:text-(--text-primary) active:opacity-0";

  return (
    <div
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`w-10 h-10 flex justify-center items-center rounded-xs dark:bg-(--bg-secondary) border dark:border-(--bg-border) hover:border-(--border-hover-btn) select-none group ${className} ${textStyleAnimation}`}
    >
      {icon}
    </div>
  );
}
