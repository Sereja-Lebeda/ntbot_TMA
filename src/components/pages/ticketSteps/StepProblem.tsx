import { useState, useRef } from "react";
import useTheme from "../../../hooks/useTheme";
import type { CategoriesPool, Action } from "../../../types/createTicket.type";

import { allActions } from "../../../utils/allActions";

import Searchbar from "../../ui/Searchbar";
import { hoverAnimationStyle } from "../../../styles/pressAnimation";
import { shadowLiftCategoryStyle } from "../../../styles/shadowLift";

import { categories } from "../../../data/categories";

import ArrowIcon from "../../../icons/filterblock/ArrowIcon";
import BackArrowIcon from "../../../icons/createTicket/BackArrowIcon";

interface StepProblemProps {
  onPrev: () => void;
  onNext: () => void;
  selectedCategory: CategoriesPool;
  selectAction: (action: Action) => void;
}

function StepProblem({
  onPrev,
  onNext,
  selectedCategory,
  selectAction,
}: StepProblemProps) {
  const [openSubcategories, setOpenSubcategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  if (!selectedCategory) {
    return null;
  }

  const categoryData = categories.find((c) => c.name === selectedCategory);

  const categoryActions = allActions.filter(
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
    <div className="xl:w-full">
      {/* Header */}
      <div className="xl:w-full xl:flex xl:flex-col xl:items-center xl:gap-4 xl:mb-7 xl:select-none">
        {/* Category name and icon */}
        <div className="xl:flex xl:justify-center xl:items-center xl:gap-3">
          <img
            src={
              theme === "light" ? categoryData?.iconLight : categoryData?.icon
            }
            alt=""
            className="xl:bg-(--text-primary) xl:rounded-xs xl:w-5 xl:h-5"
          />
          <span className="xl:font-jbmono xl:font-normal xl:text-xl xl:text-(--text-primary) xl:tracking-[0.8px]">
            {selectedCategory}
          </span>
        </div>

        {/* Text hint */}
        <div>
          <span className="xl:font-consolas xl:font-normal xl:text-sm xl:text-(--text-secondary) xl:leading-normal">
            Выберите проблему или найдите через поиск
          </span>
        </div>
      </div>

      <div className="xl:w-full xl:flex xl:flex-col xl:gap-7">
        {/* //TODO: Add debounce after connection to BD */}
        <Searchbar
          searchRequest={searchQuery}
          setSearchRequest={setSearchQuery}
          className={hoverAnimationStyle}
          ref={inputRef}
        />
        {/* Subcategory containter */}
        <div className="xl:w-full xl:flex">
          <div className="xl:w-full xl:flex xl:flex-col xl:gap-3">
            {subcategories.map((sub) => {
              // действия этой подкатегории
              const subActions = filteredActions.filter(
                (a) => a.subcategory === sub,
              );
              const isOpen =
                searchQuery !== "" || openSubcategories.includes(sub);

              return (
                <div
                  className={`xl:w-full xl:flex xl:flex-col xl:justify-start xl:bg-(--bg-secondary) xl:px-5 xl:py-4 xl:transition-transform xl:duration-900 xl:border xl:border-(--bg-border) xl:cursor-pointer ${isOpen ? "xl:border-(--border-hover-btn)!" : "xl:hover:border-(--border-hover-btn)"}`}
                  key={sub}
                  onClick={() => toggleSubcategory(sub)}
                >
                  {/* Заголовок аккордеона */}
                  <div
                    className={`xl:w-full xl:flex xl:justify-between xl:items-center ${isOpen ? "xl:pb-6" : ""}`}
                  >
                    <div className="xl:space-x-2 xl:select-none">
                      <span className="xl:font-jbmono xl:font-normal xl:text-sm xl:text-(--text-primary) xl:tracking-[0.8px]">
                        {sub}
                      </span>
                      <span className="xl:font-jbmono xl:font-light xl:text-sm xl:text-(--text-primary) xl:tracking-[0.8px]">
                        [{subActions.length}]{/* стрелка-индикатор */}
                      </span>
                    </div>
                    <ArrowIcon
                      className={`xl:text-(--text-secondary) xl:transition-transform xl:duration-300 ${isOpen ? "" : "xl:rotate-180"}`}
                    />
                  </div>

                  {/* Список действий — если открыт */}
                  {isOpen && (
                    <div className="xl:w-full xl:space-y-2">
                      {subActions.map((action) => (
                        <div
                          className="xl:bg-(--text-primary) xl:rounded-xs xl:select-none"
                          key={action.id}
                        >
                          <div
                            // TODO: Узнать будет ли фиксированное количество и скролл бар, чтобы сделать анимацию через высоту
                            className={`xl:w-full xl:py-5 xl:px-4 xl:rounded-xs
                              xl:bg-(--bg-secondary)
                              xl:border border-(--border-hover-btn) xl:cursor-pointer
                              xl:hover:text-(--text-primary)
                            xl:font-consolas xl:font-bold xl:text-sm xl:text-(--text-tertiary) xl:leading-4.5
                            ${shadowLiftCategoryStyle}
                            `}
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
          className="xl:flex xl:items-center xl:justify-start xl:gap-1 xl:rounded-xs xl:group xl:cursor-pointer xl:select-none xl:pb-4"
          onClick={onPrev}
        >
          <BackArrowIcon className="xl:text-(--text-secondary) xl:group-hover:text-(--text-primary)" />
          <span className="xl:font-jbmono xl:font-medium xl:text-(--text-secondary) xl:text-xs xl:leading-normal xl:group-hover:text-(--text-primary)">
            Назад
          </span>
        </button>
      </div>
    </div>
  );
}

export default StepProblem;
