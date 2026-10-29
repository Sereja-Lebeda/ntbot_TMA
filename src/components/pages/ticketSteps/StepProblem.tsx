import { useState, useRef } from "react";
import useTheme from "../../../hooks/useTheme";
import useIsTablet from "../../../hooks/useIsTablet";

import { categories } from "../../../data/categories";

import type { CategoriesPool, Action } from "../../../types/createTicket.type";

import Searchbar from "../../ui/Searchbar";
import { hoverAnimationStyle } from "../../../styles/pressAnimation";
import { shadowLiftCategoryStyle } from "../../../styles/shadowLift";

import ArrowIcon from "../../../icons/filterblock/ArrowIcon";
import BackArrowIcon from "../../../icons/createTicket/BackArrowIcon";
import useCatalogTree from "../../../hooks/useCatalogTree";
import ListStateMessage from "../../ui/ListStateMessage";
import { ApiError } from "../../../api/client";
import SubcategorySkeleton from "../../ui/Skeletons/SubcategorySkeleton";
import { mapAction } from "../../../api/mappers";

interface StepProblemProps {
  onPrev: () => void;
  onNext: () => void;
  selectedCategory: CategoriesPool;
  selectAction: (action: Action) => void;
}

const SKELETON_COUNT = 4;

function StepProblem({
  onPrev,
  onNext,
  selectedCategory,
  selectAction,
}: StepProblemProps) {
  const [openSubcategories, setOpenSubcategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isTablet = useIsTablet();

  const { tree, isLoading, error, reload } = useCatalogTree(
    selectedCategory?.id,
  );

  if (!selectedCategory) {
    return null;
  }

  const category = selectedCategory;

  const categoryData = categories.find((c) => c.name === selectedCategory.name);

  const query = searchQuery.toLowerCase();
  const filteredTree = tree
    .map((sub) => ({
      ...sub,
      actions: sub.actions.filter((action) =>
        action.name.toLowerCase().includes(query),
      ),
    }))
    .filter((sub) => sub.actions.length > 0);

  function renderContent() {
    if (error) {
      const isUnauthorized = error instanceof ApiError && error.status === 401;
      return (
        <ListStateMessage
          variant={isUnauthorized ? "unauthorized" : "error"}
          onRetry={reload}
        />
      );
    }

    if (isLoading) {
      return (
        <div className="w-full flex flex-col gap-3">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <SubcategorySkeleton key={i} />
          ))}
        </div>
      );
    }

    if (filteredTree.length === 0) {
      return <ListStateMessage variant="emptyFiltered" />;
    }

    return (
      <div className="w-full flex flex-col gap-3">
        {filteredTree.map((sub) => {
          const isOpen =
            searchQuery !== "" || openSubcategories.includes(sub.id);

          return (
            <div
              className={`w-full flex flex-col justify-start bg-(--bg-secondary) px-5 py-4 transition-transform duration-900 border border-(--bg-border) cursor-pointer ${isOpen ? "border-(--border-hover-btn)!" : "hover:border-(--border-hover-btn)"}`}
              key={sub.id}
              onClick={(e) => {
                e.stopPropagation();
                toggleSubcategory(sub.id);
              }}
            >
              {/* Заголовок аккордеона */}
              <div
                className={`w-full flex justify-between items-center ${isOpen ? "pb-6" : ""}`}
              >
                <div className="space-x-2 select-none">
                  <span className="font-jbmono font-normal text-sm text-(--text-primary) tracking-[0.8px]">
                    {sub.name}
                  </span>
                  <span className="font-jbmono font-light text-sm text-(--text-primary) tracking-[0.8px]">
                    [{sub.actions.length}]
                  </span>
                </div>
                <ArrowIcon
                  className={`text-(--text-secondary) transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`}
                />
              </div>

              {/* Список действий — если открыт */}
              {isOpen && (
                <div className="w-full space-y-2">
                  {sub.actions.map((action) => (
                    <div
                      className="bg-(--text-primary) rounded-xs select-none"
                      key={action.action_id}
                    >
                      <div
                        className={`w-full py-5 px-4 rounded-xs
                      bg-(--bg-secondary)
                      border border-(--border-hover-btn) cursor-pointer
                      hover:text-(--text-primary)
                      font-consolas font-bold text-sm text-(--text-tertiary) leading-4.5
                      ${shadowLiftCategoryStyle}
                    `}
                        onClick={() => {
                          selectAction(
                            mapAction({
                              action,
                              categoryId: category.id,
                              categoryName: category.name,
                              subcategoryId: sub.id,
                              subcategoryName: sub.name,
                            }),
                          );
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
    );
  }

  function toggleSubcategory(sub: number) {
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
      {!isTablet && (
        <div className="w-full flex flex-col items-center gap-4 mb-7 xl:select-none">
          {/* Category name and icon */}
          <div className="flex justify-center items-center gap-3">
            <img
              src={
                theme === "light" ? categoryData?.iconLight : categoryData?.icon
              }
              alt=""
              className="bg-(--text-primary) rounded-xs w-5 h-5"
            />
            <span className="font-jbmono font-normal text-xl text-(--text-primary) tracking-[0.8px]">
              {selectedCategory.name}
            </span>
          </div>
          {/* Text hint */}
          <div>
            <span className="font-consolas font-normal text-sm text-(--text-secondary) leading-normal">
              Выберите проблему или найдите через поиск
            </span>
          </div>
        </div>
      )}

      <div className="w-full flex flex-col gap-7">
        {/* //TODO: Add debounce after connection to BD */}
        <Searchbar
          searchRequest={searchQuery}
          setSearchRequest={setSearchQuery}
          className={hoverAnimationStyle}
          ref={inputRef}
        />
        {/* Subcategory containter */}
        <div className="w-full flex">{renderContent()}</div>
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
