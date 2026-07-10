import { useState, useRef } from "react";
import type { CategoriesPool, Action } from "../../../types/createTicket.type";

import mockActionInfo from "../../../../mockActions.json";
import Searchbar from "../../ui/Searchbar";
import { hoverAnimationStyle } from "../../../styles/pressAnimation";
import { categories } from "../../../data/categories";

import ArrowIcon from "../../../icons/filterblock/ArrowIcon";
import BackArrowIcon from "../../../icons/createTicket/BackArrowIcon";

interface StepProblemProps {
  onPrev: () => void;
  onNext: () => void;
  selectedCategory: CategoriesPool;
  selectAction: (action: Action) => void;
}
//TODO: add modal window for closing
//TODO: need to change logic to new nested action mock
function StepProblem({
  onPrev,
  onNext,
  selectedCategory,
  selectAction,
}: StepProblemProps) {
  const [openSubcategories, setOpenSubcategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!selectedCategory) {
    return null;
  }

  const mockAction = mockActionInfo as unknown as Action[];

  const categoryActions = mockAction.filter(
    (a) => a.category === selectedCategory,
  );
  const filteredActions = categoryActions.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const subcategories = [...new Set(filteredActions.map((a) => a.subcategory))];

  function toggleSubcategory(sub: string) {
    setOpenSubcategories(
      (prev) =>
        prev.includes(sub)
          ? prev.filter((s) => s !== sub) // был открыт → убрать (закрыть)
          : [...prev, sub], // был закрыт → добавить (открыть)
    );
  }

  // console.log(categoryActions, subcategories);
  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full flex flex-col items-center gap-4 mb-7 select-none">
        {/* Category name and icon */}
        <div className="flex justify-center items-center gap-3">
          <img
            src={`${categories.find((c) => c.name === selectedCategory)?.icon}`}
            alt=""
            className="bg-(--text-primary) rounded-xs w-5 h-5"
          />
          <span className="font-jbmono font-normal text-xl text-(--text-primary) tracking-[0.8px]">
            {selectedCategory}
          </span>
        </div>

        {/* Text hint */}
        <div>
          <span className="font-consolas font-normal text-sm text-(--text-secondary) leading-normal">
            Выберите проблему или найдите через поиск
          </span>
        </div>
      </div>

      <div
        // onMouseDown={(e) => {
        //   if (e.target !== inputRef.current) {
        //     e.preventDefault();
        //     inputRef.current?.blur();
        //   }
        // }}
        className="w-full flex flex-col gap-7"
      >
        {/* //TODO: Add debounce after connection to BD */}
        <Searchbar
          searchRequest={searchQuery}
          setSearchRequest={setSearchQuery}
          className={hoverAnimationStyle}
          ref={inputRef}
        />
        {/* Subcategory containter */}
        <div className="w-full flex">
          <div className={`w-full flex flex-col gap-3`}>
            {subcategories.map((sub) => {
              // действия этой подкатегории
              const subActions = filteredActions.filter(
                (a) => a.subcategory === sub,
              );
              const isOpen =
                searchQuery !== "" || openSubcategories.includes(sub);

              return (
                <div
                  className={`w-full flex flex-col justify-start bg-(--bg-secondary) px-5 py-4 transition-transform duration-900 border border-(--bg-border) cursor-pointer ${isOpen ? "border-(--border-hover-btn)!" : "hover:border-(--border-hover-btn)"}`}
                  key={sub}
                  onClick={() => toggleSubcategory(sub)}
                >
                  {/* Заголовок аккордеона */}
                  <div
                    className={`w-full flex justify-between items-center ${isOpen ? "pb-6" : ""}`}
                  >
                    <div className="space-x-2 select-none">
                      <span className="font-jbmono font-normal text-sm text-(--text-primary) tracking-[0.8px]">
                        {sub}
                      </span>
                      <span className="font-jbmono font-light text-sm text-(--text-primary) tracking-[0.8px]">
                        [{subActions.length}]{/* стрелка-индикатор */}
                      </span>
                    </div>
                    <ArrowIcon
                      className={`text-(--text-secondary) transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`}
                    />
                  </div>

                  {/* Список действий — если открыт */}
                  {isOpen && (
                    <div className="w-full space-y-2">
                      {subActions.map((action) => (
                        <div
                          className="bg-(--text-primary) rounded-xs select-none"
                          key={action.id}
                        >
                          <div
                            // TODO: Узнать будет ли фиксированное количество и скролл бар, чтобы сделать анимацию через высоту
                            className="w-full bg-(--bg-secondary) border border-(--border-hover-btn) rounded-xs py-5 px-4 cursor-pointer
                            font-consolas font-bold text-sm text-(--text-tertiary) leading-4.5
                            transition-all duration-600 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:z-10
                            hover:text-(--text-primary)
                            "
                            onClick={() => {
                              selectAction(action);
                              onNext();
                            }}
                          >
                            {action.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <button
          className="flex items-center justify-start gap-1 rounded-xs group cursor-pointer select-none pb-4"
          onClick={onPrev}
        >
          <BackArrowIcon className="text-(--text-secondary) group-hover:text-(--text-primary)" />
          <span className="font-jbmono font-medium text-(--text-secondary) text-xs leading-normal group-hover:text-(--text-primary)">
            Назад
          </span>
        </button>
      </div>
    </div>
  );
}

export default StepProblem;
