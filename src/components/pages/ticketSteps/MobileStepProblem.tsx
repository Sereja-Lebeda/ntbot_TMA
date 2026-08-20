import { useNavigate, useOutletContext } from "react-router";
import { useState, useRef, useEffect } from "react";
// import useMediaQuery from "../../../hooks/useMediaQuery";

import type { Action, CategoriesPool } from "../../../types/createTicket.type";

import { allActions } from "../../../utils/allActions";

import Searchbar from "../../ui/Searchbar";

import { hoverAnimationStyle } from "../../../styles/pressAnimation";
import { shadowLiftCategoryStyle } from "../../../styles/shadowLift";
import ArrowIcon from "../../../icons/filterblock/ArrowIcon";
import CrossIcon from "../../../icons/card/CrossIcon";

interface OutletContextProps {
  selectedCategory: CategoriesPool;
  setSelectedAction: React.Dispatch<
    React.SetStateAction<Action | null | undefined>
  >;
}

function MobileStepProblem() {
  // const isDesktop = useMediaQuery("(min-width: 1280px)");
  const navigate = useNavigate();

  const { selectedCategory, setSelectedAction } =
    useOutletContext<OutletContextProps>();

  const [openSubcategories, setOpenSubcategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedCategory) {
      navigate("../category", { replace: true });
    }
  }, [selectedCategory, navigate]);

  if (!selectedCategory) return null;

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

  function onNext() {
    navigate("../problem");
  }

  function onPrev() {
    navigate(-1);
  }

  return (
    <div
      className={`w-full max-w-251 flex-1 flex flex-col gap-7
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
      <div className="w-full flex">
        <div className="w-full flex flex-col gap-3">
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
                          className={`w-full py-5 px-4 rounded-xs
                              bg-(--bg-secondary)
                              border border-(--border-hover-btn) cursor-pointer
                              hover:text-(--text-primary)
                            font-consolas font-bold text-sm text-(--text-tertiary) leading-4.5
                            ${shadowLiftCategoryStyle}
                            `}
                          onClick={() => {
                            setSelectedAction(action);
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
