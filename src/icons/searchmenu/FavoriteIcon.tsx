interface FavoriteProps {
  ticketId: number;
  favoriteTickets?: number[];
  setFavoriteTickets: (id: number[]) => void;
  className?: string;
}

export default function FavoriteIcon({
  className,
  ticketId,
  favoriteTickets,
  setFavoriteTickets,
}: FavoriteProps) {
  function toggleFavorite(ticketId: number) {
    if (!favoriteTickets || !setFavoriteTickets) return;
    if (favoriteTickets?.includes(ticketId)) {
      const newFavorite = favoriteTickets.filter((i) => i !== ticketId);
      setFavoriteTickets(newFavorite);
    } else {
      setFavoriteTickets([...(favoriteTickets ?? []), ticketId]);
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      className={`${favoriteTickets?.includes(ticketId) ? "fill-(--text-tertiary) text-(--text-tertiary) hover:fill-(--text-primary) hover:text-(--text-primary)" : "text-(--text-secondary) hover:text-(--text-primary)"} ${className}`}
      onClick={() => {
        toggleFavorite(ticketId);
      }}
    >
      <path
        style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
        d="M9.75 0.75L7.27921 6.80607L0.75 7.28972L5.75467 11.5164L4.18808 17.8668L9.75 14.4182M9.75 0.75L12.2208 6.80607L18.75 7.28972L13.7453 11.5164L15.3119 17.8668L9.75 14.4182"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
