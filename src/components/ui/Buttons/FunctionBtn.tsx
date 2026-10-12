import { hapticTap } from "../../../utils/haptics";

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
  function handleClick() {
    hapticTap();
    onClick();
  }

  return (
    <button disabled={disabled} onClick={handleClick} className={btnClassName}>
      {/* Top layer of btn */}
      <div className={innerDivClassName}>
        <Icon className={iconClassName} />
        <span className={textClassName}>{text}</span>
      </div>
    </button>
  );
}

export default FunctionBtn;
