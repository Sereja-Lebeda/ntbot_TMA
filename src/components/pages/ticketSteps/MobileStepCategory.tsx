import { useNavigate, useOutletContext } from "react-router";
import useTheme from "../../../hooks/useTheme";

import type { CategoriesPool } from "../../../types/createTicket.type";

import { categories } from "../../../data/categories";

import CategoryGridCard from "../../ui/CategoryGridCard";
import useIsTablet from "../../../hooks/useIsTablet";
import CrossIcon from "../../../icons/card/CrossIcon";

interface OutletContextProps {
  setSelectedCategory: (category: CategoriesPool) => void;
}

function MobileStepCategory() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isTablet = useIsTablet();

  const { setSelectedCategory } = useOutletContext<OutletContextProps>();

  function onNext() {
    navigate("../problem");
  }

  function onPrev() {
    navigate("/");
  }

  return (
    // Grid of categories
    <>
      <div
        className={`w-full h-full
        flex justify-center items-start
        ${isTablet && ""}
        `}
      >
        <div className="grid grid-cols-2 gap-3 py-3">
          {categories.map((category) => (
            <CategoryGridCard
              key={category.name}
              iconPng={theme === "light" ? category.iconLight : category.icon}
              title={category.name}
              onClick={() => {
                setSelectedCategory(category.name);
                onNext();
              }}
            />
          ))}
        </div>
      </div>
      {/* Back btn */}
      <button
        onClick={onPrev}
        className="flex justify-center items-center gap-1 py-2.25 mb-2.25 cursor-pointer group select-none"
      >
        <CrossIcon className="w-2 h-2 text-(--text-secondary) group-hover:text-(--text-primary)" />
        <span className="font-jbmono font-medium text-(--text-secondary) text-xs leading-normal group-hover:text-(--text-primary)">
          Отмена
        </span>
      </button>
    </>
  );
}

export default MobileStepCategory;
