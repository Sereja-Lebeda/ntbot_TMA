interface FunctionBtnProps {
  Icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;

  text: string;
  textClassName?: string;

  outerDivClassName?: string;
  outerBtnClassName?: string;
  innerDivClassName?: string;

  onClick: () => void;
  disabled?: boolean;
}

function FunctionBtn({
  Icon,
  text,
  onClick,
  iconClassName,
  outerDivClassName,
  outerBtnClassName,
  innerDivClassName,
  textClassName,
  disabled,
}: FunctionBtnProps) {
  return (
    <div className={outerDivClassName}>
      {/* //Background white */}
      <button
        disabled={disabled}
        onClick={onClick}
        className={outerBtnClassName}
      >
        {/* Top layer of btn */}
        <div className={innerDivClassName}>
          <Icon className={iconClassName} />
          <span className={textClassName}>{text}</span>
        </div>
      </button>
    </div>
  );
}

export default FunctionBtn;
