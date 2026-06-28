interface MidPriorityIconProps {
  className?: string;
}

function MidPriorityIcon({ className }: MidPriorityIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.35059 10.7998V14.75H4.4502V10.7998H1.35059Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <path
        d="M6.4502 6.75V14.75H9.5498V6.75H6.4502Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      <path
        d="M11.5508 1.25V14.75H14.6504V1.25H11.5508Z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export default MidPriorityIcon;
