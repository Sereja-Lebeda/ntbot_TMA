interface PcIcon {
  className?: string;
}

function PcIcon({ className }: PcIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <path
        d="M1.05 11.0526H6.3V12.5263H4.2V14H9.8V12.5263H7.7V11.0526H12.95C13.531 11.0526 14 10.5589 14 9.94737V1.10526C14 0.493684 13.531 0 12.95 0H1.05C0.469 0 0 0.493684 0 1.10526V9.94737C0 10.5589 0.469 11.0526 1.05 11.0526ZM1.4 1.47368H12.6V8.10526H1.4V1.47368Z"
        fill="#908E8E"
      />
    </svg>
  );
}

export default PcIcon;
