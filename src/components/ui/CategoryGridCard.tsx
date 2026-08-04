import { shadowLiftCategoryStyle } from "../../styles/shadowLift";

interface CategoryGridCardProps {
  iconPng: string;
  title: string;
  onClick: () => void;
}

function CategoryGridCard({ iconPng, title, onClick }: CategoryGridCardProps) {
  return (
    <div
      className={`xl:w-full xl:h-32.5 xl:px-8 xl:py-9 xl:gap-2.5
        xl:flex xl:justify-start xl:items-center
        xl:rounded-xs xl:group xl:select-none
        xl:bg-(--bg-secondary)
        xl:border border-(--bg-border)
        xl:hover:border-(--text-primary)
        ${shadowLiftCategoryStyle}
        `}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="xl:w-10 xl:h-10 xl:flex xl:justify-center xl:items-center xl:bg-(--text-secondary) xl:group-hover:bg-(--text-primary) xl:rounded-xs xl:shrink-0">
        <img
          src={iconPng}
          alt={title}
          className="xl:w-8 xl:h-8 xl:object-contain"
        />
      </div>
      {/* Title */}
      <span className="xl:flex-1 xl:font-consolas xl:font-normal xl:text-lg xl:leading-4.5 xl:tracking-[0.8px] xl:text-(--text-secondary) xl:group-hover:text-(--text-primary)">
        {title}
      </span>
    </div>
  );
}

export default CategoryGridCard;
