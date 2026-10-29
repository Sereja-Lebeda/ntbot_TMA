import { useNavigate, useOutletContext } from "react-router";
import { useState, useRef, useEffect } from "react";
import useMediaQuery from "../../../hooks/useMediaQuery";

import type { Action, CategoriesPool } from "../../../types/createTicket.type";

import Searchbar from "../../ui/Searchbar";

import { hoverAnimationStyle } from "../../../styles/pressAnimation";
import { shadowLiftCategoryStyle } from "../../../styles/shadowLift";
import ArrowIcon from "../../../icons/filterblock/ArrowIcon";
import CrossIcon from "../../../icons/card/CrossIcon";
import { hapticTap } from "../../../utils/haptics";
import useCatalogTree from "../../../hooks/useCatalogTree";
import ListStateMessage from "../../ui/ListStateMessage";
import { ApiError } from "../../../api/client";
import SubcategorySkeleton from "../../ui/Skeletons/SubcategorySkeleton";
import { mapAction } from "../../../api/mappers";

interface OutletContextProps {
  selectedCategory: CategoriesPool;
  setSelectedAction: React.Dispatch<
    React.SetStateAction<Action | null | undefined>
  >;
}

const SKELETON_COUNT = 4;

function MobileStepProblem() {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const navigate = useNavigate();

  const { selectedCategory, setSelectedAction } =
    useOutletContext<OutletContextProps>();

  const { tree, isLoading, error, reload } = useCatalogTree(
    selectedCategory?.id,
  );

  const [openSubcategories, setOpenSubcategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedCategory) {
      navigate("../category", { replace: true });
    }
  }, [selectedCategory, navigate]);

  if (!selectedCategory) return null;

  const category = selectedCategory;

  const query = searchQuery.toLowerCase();
  const filteredTree = tree
    .map((sub) => ({
      ...sub,
      actions: sub.actions.filter((action) =>
        action.name.toLowerCase().includes(query),
      ),
    }))
    .filter((sub) => sub.actions.length > 0);

  function toggleSubcategory(sub: number) {
    if (searchQuery === "") {
      hapticTap();
    }
    setOpenSubcategories(
      (prev) =>
        prev.includes(sub)
          ? prev.filter((s) => s !== sub) // был открыт → убрать (закрыть)
          : [...prev, sub], // был закрыт → добавить (открыть)
    );
  }

  function onNext() {
    navigate("../details");
  }

  function onPrev() {
    hapticTap();
    navigate("/");
  }

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
              onClick={() => {
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
                    [{sub.actions.length}]{/* стрелка-индикатор */}
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
                        // TODO: Узнать будет ли фиксированное количество и скролл бар, чтобы сделать анимацию через высоту
                        className={`w-full py-5 px-4 rounded-xs
                              bg-(--bg-secondary)
                              border border-(--border-hover-btn) cursor-pointer
                            font-consolas font-bold text-sm text-(--text-tertiary) leading-4.5
                            ${isDesktop ? "hover:text-(--text-primary)" : "hover:text-(--bg-btn-primary)"}
                            ${shadowLiftCategoryStyle}
                            `}
                        onClick={(e) => {
                          hapticTap();
                          e.stopPropagation();
                          setSelectedAction(
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

  return (
    <div
      className={`w-full max-w-251 min-h-0 flex-1 flex flex-col gap-7
    px-2`}
    >
      {/* //TODO: Add debounce after connection to BD */}
      <Searchbar
        searchRequest={searchQuery}
        setSearchRequest={setSearchQuery}
        className={`${hoverAnimationStyle} mx-0! px-5! flex-none! h-auto!`}
        ref={inputRef}
      />
      {/* Subcategory container */}
      <div className="w-full flex">{renderContent()}</div>

      <button
        className="flex items-center justify-center gap-1
        rounded-xs group cursor-pointer select-none mt-auto mb-4 self-center"
        onClick={onPrev}
      >
        <CrossIcon className="w-2 h-2 text-(--text-secondary) group-hover:text-(--text-primary)" />
        <span className="font-jbmono font-medium text-(--text-secondary) text-xs leading-normal group-hover:text-(--text-primary)">
          Отмена
        </span>
      </button>
    </div>
  );
}

export default MobileStepProblem;
