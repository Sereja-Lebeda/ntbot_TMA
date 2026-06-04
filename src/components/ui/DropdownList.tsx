// import { useState } from "react";
import ArrowIcon from "../../icons/filterblock/ArrowIcon";
import SquareCheckIcon from "../../icons/filterblock/SquareCheckIcon";
import SquareIcon from "../../icons/filterblock/SquareIcon";

interface DropdownListProps {
  items: string[];
  isOpen: boolean;
  onChange: (name: string) => void;
  title: string;
  selectedItems?: string[];
  setSelectedItems?: (filter: string[]) => void;
}

function DropdownList({
  items,
  isOpen,
  onChange,
  title,
  selectedItems,
  setSelectedItems,
}: DropdownListProps) {
  const handleSelect = (item: string) => {
    if (setSelectedItems && selectedItems) {
      if (item === "Все") {
        setSelectedItems(["Все"]);
      } else {
        if (selectedItems.includes(item)) {
          const newSelected = selectedItems.filter(
            (i) => i !== item && i !== "Все",
          );
          if (newSelected.length === 0) {
            setSelectedItems(["Все"]);
          } else {
            setSelectedItems(newSelected);
          }
        } else {
          setSelectedItems([...selectedItems.filter((i) => i !== "Все"), item]);
        }
      }
    }
  };

  return (
    <div className="w-full  flex flex-col items-start bg-(--bg-primary-second) group/dropdown cursor-pointer">
      <div
        className={`w-full flex justify-between items-center border-b border-(--bg-border) bg-(--bg-primary-second) px-5 py-3.75 ${isOpen ? "" : "group-hover/dropdown:border-b group-hover/dropdown:border-(--text-primary)"}`}
        onClick={() => onChange(title)}
      >
        <span
          className={`font-jbmono text-sm  font-normal leading-4 select-none ${isOpen ? "text-(--text-primary)" : "group-hover/dropdown:text-(--text-primary) text-(--text-secondary)"}`}
        >
          {title}
        </span>
        <ArrowIcon className={isOpen ? "" : "rotate-180"} />
      </div>

      <div
        className={`w-full flex flex-col justify-start items-start gap-1 py-1 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-79 overflow-y-auto overscroll-contain dropdown-scroll" : "max-h-0"}`}
      >
        {items.map((item) => {
          return (
            <div
              key={item}
              className="w-full flex items-center gap-1.5 select-none"
              onClick={() => handleSelect(item)}
            >
              {selectedItems?.includes(item) ? (
                <div className="h-full flex-1 flex items-center gap-2 px-3 py-2">
                  <SquareCheckIcon />
                  <span className="text-sm text-(--bg-btn-primary) font-consolas font-bold leading-4.5">
                    {item}
                  </span>
                </div>
              ) : (
                <div className="h-full flex-1 flex items-center gap-2 px-3 py-2 cursor-pointer group/item">
                  <SquareIcon className="" />
                  <span className="text-sm text-(--text-secondary) font-consolas font-normal leading-4.5 group-hover/item:text-(--text-primary)">
                    {item}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DropdownList;
