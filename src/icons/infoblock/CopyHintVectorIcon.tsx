interface CopyHintVectorProps {
  className?: string;
}

function CopyHintVectorIcon({ className }: CopyHintVectorProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="9"
      viewBox="0 0 8 9"
      fill="none"
      className={className}
    >
      <path
        d="M6.56016 8.49907L6.43848 0.5L0.500014 4.5908L6.56016 8.49907Z"
        fill="#201E1E"
        stroke="#201E1E"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CopyHintVectorIcon;
