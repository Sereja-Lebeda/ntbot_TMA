import useMediaQuery from "../../hooks/useMediaQuery";

function CategoryCardSkeleton() {
  const isMobile = useMediaQuery("(max-width: 550px)");

  return (
    <div
      className={`w-full px-8 py-9 gap-2.5
        ${isMobile ? "h-38 flex flex-col justify-center items-center text-center" : "h-32.5 flex justify-start items-center"}
        rounded-xs select-none
        bg-(--bg-secondary)
        border border-(--bg-border)
        animate-pulse`}
    >
      {/* Icon */}
      <div className="w-10 h-10 bg-(--bg-border) rounded-xs shrink-0"></div>
      {/* Title */}
      <div className="h-4 w-2/3 rounded-xs bg-(--bg-border)" />
    </div>
  );
}

export default CategoryCardSkeleton;
