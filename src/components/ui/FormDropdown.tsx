import { useState, useRef, useEffect } from "react";
import ArrowIcon from "../../icons/filterblock/ArrowIcon";

interface FormDropownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

function FormDropdown({
  options,
  value,
  onChange,
  placeholder,
  hasError,
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
        setIsOpen((prev) => !prev);
      }}
      className={`relative 
    w-full h-10 flex flex-col justify-center items-start
    border ${isOpen ? "border-[#E7E6E6]!" : "border-(--bg-border) hover:border-(--border-hover-btn)"} rounded-xs
    ${hasError ? "border-(--bg-task-error)!" : ""}
    group hover:border-(--border-hover-btn)
    px-4 py-2.5 mt-4 cursor-pointer z-20`}
    >
      <div
        // onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex justify-between items-center "
      >
        <span
          className={`flex items-center font-consolas font-normal text-sm
          ${value ? "text-(--text-primary)" : "text-(--text-secondary)"}
          group-hover:text-(--text-primary)`}
        >
          {value || placeholder}
        </span>
        <ArrowIcon
          className={`transition-all ease-in-out duration-300
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
          {options.map((option) => (
            <div
              key={option}
              onClick={() => onChange(option)}
              className="w-full h-10 flex items-center justify-start px-6 py-2.5
              font-consolas font-normal text-sm text-(--text-primary) leading-normal
              border border-(--bg-border)
              hover:bg-[#1B1B1B]"
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
