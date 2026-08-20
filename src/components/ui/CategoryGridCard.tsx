import useMediaQuery from "../../hooks/useMediaQuery";
import { shadowLiftCategoryStyle } from "../../styles/shadowLift";

interface CategoryGridCardProps {
  iconPng: string;
  title: string;
  onClick: () => void;
}

function CategoryGridCard({ iconPng, title, onClick }: CategoryGridCardProps) {
  const isMobile = useMediaQuery("(max-width: 500px");
  const isDesktop = useMediaQuery("(max-width: 1280px");
  return (
    <div
      className={`w-full px-8 py-9 gap-2.5
        ${isMobile ? "h-38 flex flex-col justify-center items-center text-center" : "h-32.5 flex justify-start items-center"}
        cursor-pointer
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
      <span
        className={`
          ${isMobile ? "flex justify-center items-center" : ""}
          ${isDesktop ? "group-hover:text-(--bg-btn-primary)" : "group-hover:text-(--text-primary)"}
        flex-1 font-consolas font-normal text-lg leading-4.5 tracking-[0.8px] text-(--text-secondary) `}
      >
        {title}
      </span>
    </div>
  );
}

export default CategoryGridCard;
