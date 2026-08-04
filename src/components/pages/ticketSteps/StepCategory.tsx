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
    <div className="xl:w-full xl:select-none">
      {/* Header component */}
      <div className="xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-4">
        <span className="xl:font-jbmono xl:font-normal xl:text-xl xl:text-(--text-primary) xl:leading-5 xl:tracking-[0.8px]">
          Выберите категорию
        </span>
        <span className="xl:font-consolas xl:font-normal xl:text-sm xl:text-(--text-secondary) xl:leading-normal">
          С чем у вас возникла проблема?
        </span>
      </div>
      {/* Grid of categories */}
      <div className="xl:grid xl:grid-cols-3 xl:gap-3 xl:pt-7">
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
