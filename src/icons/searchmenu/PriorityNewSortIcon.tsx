interface PriorityNewSortIconProps {
  className?: string;
}

export default function PriorityNewSortIcon({
  className,
}: PriorityNewSortIconProps) {
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
        d="M5 6H1M7 12H1M9 18H1"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M17 18C20.3137 18 23 15.3137 23 12C23 8.68629 20.3137 6 17 6C13.6863 6 11 8.68629 11 12C11 15.3137 13.6863 18 17 18Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M14.5586 11.8747L16.5844 13.818L19.8054 10.6423"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
