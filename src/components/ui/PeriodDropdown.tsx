import CrossIcon from "../../icons/card/CrossIcon";
import ArrowIcon from "../../icons/filterblock/ArrowIcon";
import { hapticTap } from "../../utils/haptics";
import blurOnEnter from "../../utils/blurOnEnter";
import formatDateInput from "../../utils/formatDateInput";
import getPeriodError from "../../utils/getPeriodError";

interface PeriodDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  from: string;
  setFrom: (value: string) => void;
  to: string;
  setTo: (value: string) => void;
  isDropdownDisabled?: boolean;
}

const inputStyle =
  "w-full h-9 bg-(--bg-tertiary) border border-(--bg-border) rounded-xs px-3 py-0 font-consolas text-sm font-normal  text-(--text-primary) placeholder:text-(--text-secondary) outline-none focus:border-(--text-primary)";

function PeriodDropdown({
  isOpen,
  onToggle,
  from,
  setFrom,
  to,
  setTo,
  isDropdownDisabled = false,
}: PeriodDropdownProps) {
  const isDropdownOpen = isOpen && !isDropdownDisabled;
  const hasValue = from !== "" || to !== "";
  const periodError = getPeriodError(from, to);

  return (
    <div
      className={`w-full flex flex-col items-start bg-(--bg-primary-second) group/dropdown
    ${isDropdownDisabled ? "" : "cursor-pointer"}`}
    >
      <div
        className={`w-full flex justify-between items-center border-b border-(--bg-border) px-5 py-3.75
          ${isDropdownDisabled ? "bg-(--bg-disable-btn) select-none" : "bg-(--bg-primary-second) group-hover/dropdown:border-(--text-primary)"}`}
        onClick={
          isDropdownDisabled
            ? undefined
            : () => {
                hapticTap();
                onToggle();
              }
        }
      >
        <div className="flex gap-2 items-center">
          <span
            className={`font-jbmono text-sm font-normal leading-4 select-none
              ${isDropdownOpen ? "text-(--text-primary)" : "text-(--text-secondary)"}
              ${isDropdownDisabled ? "" : "group-hover/dropdown:text-(--text-primary)"}`}
          >
            Период
          </span>

          {/* reset btn */}
          {hasValue && !isDropdownDisabled && (
            <button
              className="w-5 h-4 flex justify-center items-center bg-(--text-secondary) rounded-xs px-1 py-0.5 cursor-pointer select-none"
              onClick={(e) => {
                e.stopPropagation();
                hapticTap();
                setFrom("");
                setTo("");
              }}
            >
              <CrossIcon className="w-2 h-2 text-(--bg-primary) block" />
            </button>
          )}
        </div>
        <ArrowIcon
          className={`${isDropdownOpen ? "text-(--text-primary)" : "rotate-180 text-(--text-secondary)"}
          ${isDropdownDisabled ? "" : "group-hover/dropdown:text-(--text-primary)"}`}
        />
      </div>

      <div
        className={`w-full flex flex-col gap-2 overflow-hidden transition-all duration-300 cursor-default ${isDropdownOpen ? "max-h-79 py-2" : "max-h-0"}`}
      >
        <label
          className="w-full flex items-center gap-2 px-3"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span className="w-6 shrink-0 font-consolas text-sm text-(--text-secondary) select-none">
            От
          </span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            enterKeyHint="done"
            autoComplete="off"
            placeholder="дд.мм.гггг"
            value={from}
            onChange={(e) => setFrom(formatDateInput(e.target.value))}
            onKeyDown={blurOnEnter}
            className={inputStyle}
          />
        </label>
        <label
          className="w-full flex items-center gap-2 px-3"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span className="w-6 shrink-0 font-consolas text-sm text-(--text-secondary) select-none">
            До
          </span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            enterKeyHint="done"
            autoComplete="off"
            placeholder="дд.мм.гггг"
            value={to}
            onChange={(e) => setTo(formatDateInput(e.target.value))}
            onKeyDown={blurOnEnter}
            className={inputStyle}
          />
        </label>
        {periodError !== null ? (
          <p className="px-3 font-consolas text-xs leading-4 text-(--bg-task-error)">
            {periodError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default PeriodDropdown;
