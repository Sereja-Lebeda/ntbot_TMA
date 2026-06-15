import type { activeSectionType } from "../../types/header.types";

interface TicketProps {
  className?: string;
  onClick: () => void;
  activeSection: activeSectionType;
  // setActiveSection: (section: string) => void;
}

export default function TicketIcon({
  className,
  onClick,
  activeSection,
  // setActiveSection,
}: TicketProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={`${activeSection === "tickets" ? "text-(--bg-btn-primary)" : "text-(--text-secondary) hover:text-[#ede8de]"} ${className}`}
    >
      <path
        d="M12.75 0H5.25C3.85807 0.00148896 2.52358 0.555091 1.53933 1.53933C0.555091 2.52358 0.00148896 3.85807 0 5.25V12.75C0.00148896 14.1419 0.555091 15.4764 1.53933 16.4607C2.52358 17.4449 3.85807 17.9985 5.25 18H9.75C9.83061 17.9999 9.91068 17.9869 9.98719 17.9616C12.4462 17.1412 17.1412 12.4462 17.9616 9.98719C17.9869 9.91068 17.9999 9.83061 18 9.75V5.25C17.9985 3.85807 17.4449 2.52358 16.4607 1.53933C15.4764 0.555091 14.1419 0.00148896 12.75 0ZM1.5 12.75V5.25C1.5 4.25544 1.89509 3.30161 2.59835 2.59835C3.30161 1.89509 4.25544 1.5 5.25 1.5H12.75C13.7446 1.5 14.6984 1.89509 15.4017 2.59835C16.1049 3.30161 16.5 4.25544 16.5 5.25V9H14.25C12.8581 9.00149 11.5236 9.55509 10.5393 10.5393C9.55509 11.5236 9.00149 12.8581 9 14.25V16.5H5.25C4.25544 16.5 3.30161 16.1049 2.59835 15.4017C1.89509 14.6984 1.5 13.7446 1.5 12.75ZM10.5 16.0444V14.25C10.5 13.2554 10.8951 12.3016 11.5983 11.5983C12.3016 10.8951 13.2554 10.5 14.25 10.5H16.0444C14.9062 12.3281 12.3281 14.9062 10.5 16.0444Z"
        fill="currentColor"
      />
    </svg>
  );
}
