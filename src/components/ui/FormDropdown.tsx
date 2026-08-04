import { useState, useRef, useEffect } from "react";
import ArrowIcon from "../../icons/filterblock/ArrowIcon";

interface FormDropownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
}

function FormDropdown({
  options,
  value,
  onChange,
  placeholder,
  hasError,
  disabled = false,
}: FormDropownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      tabIndex={0}
      onClick={() => {
        if (!disabled) setIsOpen((prev) => !prev);
      }}
      className={`xl:relative
    xl:w-full xl:h-10 xl:flex xl:flex-col xl:justify-center xl:items-start
    xl:border ${isOpen ? "xl:border-[#E7E6E6]!" : "xl:border-(--bg-border) xl:hover:border-(--border-hover-btn)"} xl:rounded-xs
    ${hasError ? "xl:border-(--bg-task-error)!" : ""}
    ${disabled ? "xl:opacity-40" : "xl:cursor-pointer xl:group xl:hover:border-(--border-hover-btn)"}
    xl:px-4 xl:py-2.5 ${isOpen ? "xl:z-50" : "xl:z-20"}
    
    `}
    >
      <div
        // onClick={() => setIsOpen(!isOpen)}
        className="xl:w-full xl:h-full xl:flex xl:justify-between xl:items-center"
      >
        <span
          className={`xl:flex xl:items-center xl:font-consolas xl:font-normal xl:text-sm
          ${value ? "xl:text-(--text-primary)" : "xl:text-(--text-secondary)"}
          xl:group-hover:text-(--text-primary)`}
        >
          {value || placeholder}
        </span>
        <ArrowIcon
          className={`xl:transition-all xl:ease-in-out xl:duration-300
          xl:group-hover:text-(--text-primary)
          ${isOpen ? "xl:text-(--text-primary)" : "xl:rotate-180 text-(--text-secondary)"}`}
        />
      </div>

      {isOpen && (
        <div className="xl:absolute xl:top-full xl:mt-px xl:-left-px xl:-right-px xl:z-50 xl:max-h-50 xl:overflow-y-auto xl:scrollbar-none xl:bg-(--bg-secondary) xl:border xl:border-(--bg-border)">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => onChange(option)}
              className="xl:w-full xl:h-10 xl:flex xl:items-center xl:justify-start xl:px-6 xl:py-2.5 xl:font-consolas xl:font-normal xl:text-sm xl:text-(--text-primary) xl:leading-normal xl:border xl:border-(--bg-border) xl:hover:bg-[#1B1B1B]"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormDropdown;
