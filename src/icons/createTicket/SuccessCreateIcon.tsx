interface SuccessCreateIconProps {
  className?: string;
}

function SuccessCreateIcon({ className }: SuccessCreateIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      className={className}
    >
      <path
        d="M32.7019 15.0002C33.3869 18.3622 32.8987 21.8574 31.3187 24.9029C29.7386 27.9485 27.1622 30.3603 24.0192 31.7362C20.8761 33.1121 17.3563 33.3689 14.0468 32.4638C10.7374 31.5587 7.83818 29.5463 5.83281 26.7624C3.82743 23.9784 2.83708 20.5911 3.02689 17.1653C3.2167 13.7395 4.57521 10.4824 6.87587 7.93699C9.17653 5.39161 12.2803 3.71187 15.6695 3.17791C19.0587 2.64394 22.5286 3.28802 25.5004 5.00273"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 16.5L18 21L33 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SuccessCreateIcon;
