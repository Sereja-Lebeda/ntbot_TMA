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
      className={`relative 
    w-full h-10 flex flex-col justify-center items-start
    border ${isOpen ? "border-[#E7E6E6]!" : "border-(--bg-border) hover:border-(--border-hover-btn)"} rounded-xs
    ${hasError ? "border-(--bg-task-error)!" : ""}
    group hover:border-(--border-hover-btn)
    px-4 py-2.5 cursor-pointer ${isOpen ? "z-50" : "z-20"}`}
    >
      <div className="w-full h-full flex justify-between items-center">
        <span
          className={`flex-1 min-w-0 truncate font-consolas font-normal text-sm
          ${displayText ? "text-(--text-primary)" : "text-(--text-secondary)"}
          group-hover:text-(--text-primary)`}
        >
          {displayText || placeholder}
        </span>
        <ArrowIcon
          className={`shrink-0 ml-2 transition-all ease-in-out duration-300
          group-hover:text-(--text-primary)
          ${isOpen ? "text-(--text-primary)" : "rotate-180 text-(--text-secondary)"}`}
        />
      </div>

      {isOpen && (
        <div
          className="absolute top-full mt-px -left-px -right-px z-50
          max-h-50 overflow-y-auto scrollbar-none
        bg-(--bg-secondary) border border-(--bg-border)"
        >
          {options.map((option) => {
            const isSelected = value.includes(option);
            return (
              <div
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option);
                }}
                className={`w-full h-10 flex items-center justify-between px-6 py-2.5
                font-consolas font-normal text-sm leading-normal
                border border-(--bg-border)
                hover:bg-[#1B1B1B]
                ${isSelected ? "text-(--bg-btn-primary) bg-[#1B1B1B]" : "text-(--text-primary)"}`}
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
