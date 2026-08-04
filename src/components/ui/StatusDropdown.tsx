import { useState, useRef, useEffect } from "react";

import ArrowIcon from "../../icons/filterblock/ArrowIcon";

interface StatusDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  badgeClassName: string;
}

function StatusDropdown({
  options,
  value,
  onChange,
  disabled = false,
  badgeClassName,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [badgeWidth, setBadgeWidth] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const badgeContentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isOpen && badgeContentRef.current) {
      setBadgeWidth(badgeContentRef.current.offsetWidth);
    }
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      tabIndex={0}
      onClick={() => {
        if (!disabled) setIsOpen((prev) => !prev);
      }}
      className={`xl:relative ${badgeClassName} ${disabled ? "xl:opacity-40" : "xl:cursor-pointer group"} ${isOpen ? "xl:z-50" : "xl:z-20"}`}
    >
      <div
        ref={badgeContentRef}
        className="xl:flex xl:justify-center xl:items-center xl:gap-1 xl:cursor-pointer"
      >
        <span className="xl:dark:text-(--text-btn) xl:text-(--text-primary) xl:text-xs xl:font-bold xl:leading-3 xl:select-none">
          {value}
        </span>
        <ArrowIcon
          className={`xl:w-5 xl:h-5 xl:transition-all ${isOpen ? "" : "xl:rotate-180"}`}
        />
      </div>

      {isOpen && (
        <div
          style={{ width: badgeWidth }}
          className="xl:absolute xl:top-full xl:left- xl:mt-px xl:z-50 xl:min-w-24 xl:max-h-70 xl:overflow-y-auto xl:scrollbar-none xl:bg-(--bg-secondary) xl:border xl:border-(--bg-border)"
        >
          {options.map((option) => (
            <div
              key={option}
              onClick={() => onChange(option)}
              className="xl:h-10 xl:flex xl:items-center xl:justify-start xl:px-2 xl:py-2.5 xl:font-consolas xl:font-normal xl:text-xs xl:text-(--text-primary) xl:leading-normal xl:border xl:border-(--bg-border) xl:hover:bg-[#1B1B1B]"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusDropdown;
