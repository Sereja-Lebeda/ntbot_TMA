import { shadowLiftCategoryStyle } from "../../styles/shadowLift";

interface CategoryGridCardProps {
  iconPng: string;
  title: string;
  onClick: () => void;
}

function CategoryGridCard({ iconPng, title, onClick }: CategoryGridCardProps) {
  return (
    <div
      className={`w-full h-32.5 px-8 py-9 gap-2.5
        flex justify-start items-center
        rounded-xs group select-none
        bg-(--bg-secondary)
        border border-(--bg-border)
        hover:border-(--text-primary)
        ${shadowLiftCategoryStyle}
        `}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="w-10 h-10 flex justify-center items-center bg-(--text-secondary) group-hover:bg-(--text-primary) rounded-xs shrink-0">
        <img src={iconPng} alt={title} className="w-8 h-8 object-contain" />
      </div>
      {/* Title */}
      <span className="flex-1 font-consolas font-normal text-lg leading-4.5 tracking-[0.8px] text-(--text-secondary) group-hover:text-(--text-primary)">
        {title}
      </span>
    </div>
  );
}

export default CategoryGridCard;
