interface FunctionBtnProps {
  Icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;

  text?: string;
  textClassName?: string;

  btnClassName?: string;
  innerDivClassName?: string;

  onClick: () => void;
  disabled?: boolean;
}

function FunctionBtn({
  Icon,
  text,
  onClick,
  iconClassName,
  innerDivClassName,
  btnClassName,
  textClassName,
  disabled,
}: FunctionBtnProps) {
  return (
    <button disabled={disabled} onClick={onClick} className={btnClassName}>
      {/* Top layer of btn */}
      <div className={innerDivClassName}>
        <Icon className={iconClassName} />
        <span className={textClassName}>{text}</span>
      </div>
    </button>
  );
}

export default FunctionBtn;
