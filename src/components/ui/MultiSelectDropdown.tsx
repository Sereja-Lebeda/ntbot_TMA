import { useState, useRef, useEffect } from "react";
import ArrowIcon from "../../icons/filterblock/ArrowIcon";

interface MultiSelectDropdownProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  hasError?: boolean;
}

function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder,
  hasError,
}: MultiSelectDropdownProps) {
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

  function toggleOption(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  }

  const displayText = value.length > 0 ? value.join("; ") : "";

  return (
    <div
      ref={dropdownRef}
      tabIndex={0}
      onClick={() => {
        setIsOpen((prev) => !prev);
      }}
      className={`xl:relative 
    xl:w-full xl:h-10 xl:flex xl:flex-col xl:justify-center xl:items-start
    xl:border ${isOpen ? "xl:border-[#E7E6E6]!" : "xl:border-(--bg-border) xl:hover:border-(--border-hover-btn)"} xl:rounded-xs
    ${hasError ? "xl:border-(--bg-task-error)!" : ""}
    xl:group xl:hover:border-(--border-hover-btn)
    xl:px-4 xl:py-2.5 xl:cursor-pointer ${isOpen ? "xl:z-50" : "xl:z-20"}`}
    >
      <div className="xl:w-full xl:h-full xl:flex xl:justify-between xl:items-center">
        <span
          className={`xl:flex-1 xl:min-w-0 xl:truncate xl:font-consolas xl:font-normal xl:text-sm
          ${displayText ? "xl:text-(--text-primary)" : "xl:text-(--text-secondary)"}
          xl:group-hover:text-(--text-primary)`}
        >
          {displayText || placeholder}
        </span>
        <ArrowIcon
          className={`xl:shrink-0 xl:ml-2 xl:transition-all xl:ease-in-out xl:duration-300
          xl:group-hover:text-(--text-primary)
          ${isOpen ? "xl:text-(--text-primary)" : "xl:rotate-180 text-(--text-secondary)"}`}
        />
      </div>

      {isOpen && (
        <div className="xl:absolute xl:top-full xl:mt-px xl:-left-px xl:-right-px xl:z-50 xl:max-h-50 xl:overflow-y-auto xl:scrollbar-none xl:bg-(--bg-secondary) xl:border xl:border-(--bg-border)">
          {options.map((option) => {
            const isSelected = value.includes(option);
            return (
              <div
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option);
                }}
                className={`xl:w-full xl:h-10 xl:flex xl:items-center xl:justify-between xl:px-6 xl:py-2.5
                xl:font-consolas xl:font-normal xl:text-sm xl:leading-normal
                xl:border xl:border-(--bg-border)
                xl:hover:bg-[#1B1B1B]
                ${isSelected ? "xl:text-(--bg-btn-primary) xl:bg-[#1B1B1B]" : "xl:text-(--text-primary)"}`}
              >
                <span>{option}</span>
                {isSelected && <span>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MultiSelectDropdown;
