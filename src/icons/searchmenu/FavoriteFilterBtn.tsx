interface FavoriteFilterBtnProps {
  showFavorites: boolean;
  className?: string;
}

export default function FavoriteFilterBtn({
  showFavorites,
  className,
}: FavoriteFilterBtnProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      // className={`text-[#908E8E] hover:text-(--text-primary) ${className}`}
      className={`${showFavorites ? "fill-(--bg-btn-primary) text-(--bg-btn-primary)" : "text-[#908E8E] group-hover:text-(--text-primary)"} ${className} `}
    >
      <path
        d="M9.75 0.75L7.27921 6.80607L0.75 7.28972L5.75467 11.5164L4.18808 17.8668L9.75 14.4182M9.75 0.75L12.2208 6.80607L18.75 7.28972L13.7453 11.5164L15.3119 17.8668L9.75 14.4182"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
