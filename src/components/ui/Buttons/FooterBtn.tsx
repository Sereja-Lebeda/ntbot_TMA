interface FooterBtnProps {
  icon: React.ReactNode;
  text: string;
  textClassName?: string;
  onClick: () => void;
}

function FooterBtn({ icon, text, textClassName, onClick }: FooterBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`h-full max-w-20
  flex flex-col justify-center items-center gap-1.5
  flex-1 cursor-pointer group
  `}
    >
      {icon}
      <span
        className={`font-jbmono font-normal
      text-xs
      leading-2.5 select-none
      ${textClassName}`}
      >
        {text}
      </span>
    </button>
  );
}

export default FooterBtn;
