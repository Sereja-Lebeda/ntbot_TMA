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
      className={`relative ${badgeClassName} ${disabled ? "opacity-40" : "cursor-pointer group"} ${isOpen ? "z-50" : "z-20"}`}
    >
      <div
        ref={badgeContentRef}
        className="flex justify-center items-center gap-1 cursor-pointer"
      >
        <span className="dark:text-(--text-btn) text-(--text-primary) text-xs font-bold leading-3 select-none">
          {value}
        </span>
        <ArrowIcon
          className={`w-5 h-5 transition-all ${isOpen ? "" : "rotate-180"}`}
        />
      </div>

      {isOpen && (
        <div
          style={{ width: badgeWidth }}
          className="absolute top-full left-0 xl:-left-2.5 mt-px z-40 min-w-24 max-h-70 overflow-y-auto scrollbar-none bg-(--bg-secondary) border border-(--bg-border)"
        >
          {options.map((option) => (
            <div
              key={option}
              onClick={() => onChange(option)}
              className="h-10 flex items-center justify-start px-2 py-2.5 font-consolas font-normal text-xs text-(--text-primary) leading-normal border border-(--bg-border) hover:bg-[#1B1B1B]"
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
