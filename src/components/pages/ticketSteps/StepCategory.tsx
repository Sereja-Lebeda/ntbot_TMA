import useTheme from "../../../hooks/useTheme";
import useIsTablet from "../../../hooks/useIsTablet";
import useCategoryList from "../../../hooks/useCategoryList";

import { ApiError } from "../../../api/client";
import { categories as categoryIcons } from "../../../data/categories";
import type { CategoriesPool } from "../../../types/createTicket.type";

import CategoryGridCard from "../../ui/CategoryGridCard";
import CategoryCardSkeleton from "../../ui/Skeletons/CategoryCardSkeleton";
import ListStateMessage from "../../ui/ListStateMessage";

const SKELETON_COUNT = 12;

interface StepCategoryProps {
  onNext: () => void;
  setSelectedCategory: (category: CategoriesPool) => void;
}

function StepCategory({ onNext, setSelectedCategory }: StepCategoryProps) {
  const { categories, isLoading, error, reload } = useCategoryList();
  const { theme } = useTheme();
  const isTablet = useIsTablet();

  const gridClassName = `grid ${isTablet ? "grid-cols-2 gap-3" : "grid-cols-1 xl:grid-cols-3 gap-3 xl:pt-7"}`;

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
        <div className={gridClassName}>
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    return (
      <div className={gridClassName}>
        {categories.map((category) => {
          const iconData =
            categoryIcons.find((c) => c.name === category.name) ??
            categoryIcons[0];

          return (
            <CategoryGridCard
              key={category.category_id}
              iconPng={theme === "light" ? iconData.iconLight : iconData.icon}
              title={category.name}
              onClick={() => {
                setSelectedCategory({
                  id: category.category_id,
                  name: category.name,
                });
                onNext();
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="xl:w-full xl:select-none">
      {!isTablet && (
        <div className="flex flex-col justify-center xl:items-center gap-2 xl:gap-4 py-1 pb-2 select-none">
          <span className="font-jbmono font-normal text-xl text-(--text-primary) leading-5 tracking-[0.8px]">
            Выберите категорию
          </span>
          <span className="font-consolas font-normal text-sm text-(--text-secondary) leading-normal">
            С чем у вас возникла проблема?
          </span>
        </div>
      )}
      {renderContent()}
    </div>
  );
}

export default StepCategory;
