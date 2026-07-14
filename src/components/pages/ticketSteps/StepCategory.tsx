import useTheme from "../../../hooks/useTheme";

import type { CategoriesPool } from "../../../types/createTicket.type";
import { categories } from "../../../data/categories";

import CategoryGridCard from "../../ui/CategoryGridCard";

interface StepCategoryProps {
  onNext: () => void;
  setSelectedCategory: (category: CategoriesPool) => void;
}

function StepCategory({ onNext, setSelectedCategory }: StepCategoryProps) {
  const { theme } = useTheme();

  return (
    <div className="w-full select-none">
      {/* Header component */}
      <div className="flex flex-col justify-center items-center gap-4">
        <span className="font-jbmono font-normal text-xl text-(--text-primary) leading-5 tracking-[0.8px]">
          Выберите категорию
        </span>
        <span className="font-consolas font-normal text-sm text-(--text-secondary) leading-normal">
          С чем у вас возникла проблема?
        </span>
      </div>
      {/* Grid of categories */}
      <div className=" grid grid-cols-3 gap-3 pt-7">
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

export default StepCategory;
