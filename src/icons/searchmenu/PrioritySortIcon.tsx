interface PrioritySortIconProps {
  className?: string;
}

export default function PrioritySortIcon({ className }: PrioritySortIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M9 6H1M7 12H1M9 18H1"
        stroke="#908E8E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 18C20.3137 18 23 15.3137 23 12C23 8.68629 20.3137 6 17 6C13.6863 6 11 8.68629 11 12C11 15.3137 13.6863 18 17 18Z"
        stroke="#908E8E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14.5586 11.8747L16.5844 13.818L19.8054 10.6423"
        stroke="#908E8E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
