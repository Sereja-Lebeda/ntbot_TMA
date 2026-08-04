// import { useState } from "react";
import CrossIcon from "../../icons/card/CrossIcon";
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
  showResetButton?: boolean;
}

function DropdownList({
  items,
  isOpen,
  onChange,
  title,
  selectedItems,
  setSelectedItems,
  showResetButton,
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

  const amountOfItems = () =>
    selectedItems?.filter((i) => i !== "Все").length ?? 0;

  return (
    <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:bg-(--bg-primary-second) xl:group/dropdown xl:cursor-pointer">
      <div
        className={`xl:w-full xl:flex xl:justify-between xl:items-center xl:border-b border-(--bg-border) xl:bg-(--bg-primary-second) xl:px-5 xl:py-3.75 ${isOpen ? "" : "xl:group-hover/dropdown:border-b xl:group-hover/dropdown:border-(--text-primary)"}`}
        onClick={() => onChange(title)}
      >
        <div className="xl:flex xl:gap-2 xl:items-center">
          <span
            className={`xl:font-jbmono xl:text-sm xl:font-normal xl:leading-4 xl:select-none ${isOpen ? "xl:text-(--text-primary)" : "xl:group-hover/dropdown:text-(--text-primary) xl:text-(--text-secondary)"}`}
          >
            {title}
          </span>

          {/* reset filter btn */}
          {showResetButton && selectedItems && amountOfItems() > 0 && (
            <button
              className="xl:w-7.5 xl:h-4 xl:flex xl:justify-center xl:items-center xl:bg-(--text-secondary) xl:rounded-xs xl:px-1 xl:py-0.5 xl:gap-1.5 xl:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect("Все");
              }}
            >
              <span className="xl:font-consolas xl:font-normal xl:text-xs xl:text-(--bg-primary) xl:leading-4">
                {amountOfItems()}
              </span>
              <CrossIcon className="xl:w-2 xl:h-2 xl:text-(--bg-primary) xl:block" />
            </button>
          )}
        </div>
        <ArrowIcon
          className={`${isOpen ? "xl:text-(--text-primary)" : "xl:rotate-180 xl:dark:text-(--text-secondary) xl:text-(--text-secondary)"}  xl:group-hover/dropdown:text-(--text-primary)`}
        />
      </div>

      <div
        className={`xl:w-full xl:flex xl:flex-col xl:justify-start xl:items-start xl:gap-1 xl:py-1 xl:overflow-hidden xl:transition-all xl:duration-300 ${isOpen ? "xl:max-h-79 xl:overflow-y-auto xl:overscroll-contain xl:dropdown-scroll" : "xl:max-h-0"}`}
      >
        {items.map((item) => {
          return (
            <div
              key={item}
              className="xl:w-full xl:flex xl:items-center xl:gap-1.5 xl:select-none"
              onClick={() => handleSelect(item)}
            >
              {selectedItems?.includes(item) ? (
                <div className="xl:h-full xl:flex-1 xl:flex xl:items-center xl:gap-2 xl:px-3 xl:py-2">
                  <SquareCheckIcon className="xl:text-(--bg-btn-primary)" />
                  <span className="xl:text-sm xl:text-(--bg-btn-primary) xl:font-consolas xl:font-bold xl:leading-4.5">
                    {item}
                  </span>
                </div>
              ) : (
                <div className="xl:h-full xl:flex-1 xl:flex xl:items-center xl:gap-2 xl:px-3 xl:py-2 xl:cursor-pointer xl:group/item">
                  <SquareIcon className="" />
                  <span className="xl:text-sm xl:text-(--text-secondary) xl:font-consolas xl:font-normal xl:leading-4.5 xl:group-hover/item:text-(--text-primary)">
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
