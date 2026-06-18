interface CategoryGridCardProps {
  iconPng: string;
  title: string;
  onClick: () => void;
}

function CategoryGridCard({ iconPng, title, onClick }: CategoryGridCardProps) {
  return (
    <div
      className="w-full h-32.5 bg-(--text-primary) rounded-xs group select-none"
      onClick={onClick}
    >
      <div className="w-full h-full bg-(--bg-secondary) border border-(--bg-border) rounded-xs cursor-pointer transition-all duration-600 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:z-10 group-hover:border-(--text-primary) flex justify-start items-center px-8 py-9 gap-2.5">
        {/* Icon */}
        <div className="w-10 h-10 flex justify-center items-center bg-(--text-secondary) group-hover:bg-(--text-primary) rounded-xs shrink-0">
          <img src={iconPng} alt={title} className="w-8 h-8 object-contain" />
        </div>
        {/* Title */}
        <span className="flex-1 font-consolas font-normal text-lg leading-4.5 tracking-[0.8px] text-(--text-secondary) group-hover:text-(--text-primary)">
          {title}
        </span>
      </div>
    </div>
  );
}

export default CategoryGridCard;
