import { useNavigate, useOutletContext } from "react-router";
import useTheme from "../../../hooks/useTheme";
import useCategoryList from "../../../hooks/useCategoryList";

import { ApiError } from "../../../api/client";
import { categories as categoryIcons } from "../../../data/categories";
import type { CategoriesPool } from "../../../types/createTicket.type";
import { hapticTap } from "../../../utils/haptics";

import CategoryGridCard from "../../ui/CategoryGridCard";
import CategoryCardSkeleton from "../../ui/CategoryCardSkeleton";
import ListStateMessage from "../../ui/ListStateMessage";
import CrossIcon from "../../../icons/card/CrossIcon";

const SKELETON_COUNT = 12;
const GRID_CLASS_NAME = "grid grid-cols-2 gap-3 py-3 w-full";

interface OutletContextProps {
  setSelectedCategory: (category: CategoriesPool) => void;
}

function MobileStepCategory() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { categories, isLoading, error, reload } = useCategoryList();

  const { setSelectedCategory } = useOutletContext<OutletContextProps>();

  function onNext() {
    navigate("../problem");
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
        <div className={GRID_CLASS_NAME}>
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    return (
      <div className={GRID_CLASS_NAME}>
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
    <>
      <div
        className={`w-full
        flex justify-center items-center`}
      >
        {renderContent()}
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
