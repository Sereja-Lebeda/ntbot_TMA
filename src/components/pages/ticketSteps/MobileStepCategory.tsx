import { useNavigate, useOutletContext } from "react-router";
import useTheme from "../../../hooks/useTheme";
import useMediaQuery from "../../../hooks/useMediaQuery";

import type { CategoriesPool } from "../../../types/createTicket.type";

import { categories } from "../../../data/categories";

import CategoryGridCard from "../../ui/CategoryGridCard";

interface OutletContextProps {
  setSelectedCategory: (category: CategoriesPool) => void;
}

function MobileStepCategory() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const { setSelectedCategory } = useOutletContext<OutletContextProps>();

  function onNext() {
    navigate("../problem");
  }

  return (
    // Grid of categories
    <div
      className={`w-full h-full
      flex justify-center items-center
      ${isDesktop ? "" : "mb-20"}
      `}
    >
      <div className="grid grid-cols-2 gap-1.5 px-2 py-3">
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
  );
}

export default MobileStepCategory;
