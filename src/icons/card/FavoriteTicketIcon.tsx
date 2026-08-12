interface FavoriteProps {
  ticketId: number;
  favoriteTickets?: number[];

  className?: string;
}

export default function FavoriteTicketIcon({
  className,
  ticketId,
  favoriteTickets,
}: FavoriteProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="-1.5 -1.5 20 20"
      fill="none"
      className={`${favoriteTickets?.includes(ticketId) ? "fill-(--text-tertiary) text-(--text-tertiary) hover:fill-(--text-primary) hover:text-(--text-primary)" : "text-(--text-tertiary) hover:text-(--text-primary)"} ${className}`}
    >
      <path
        d="M8.5 0.5L6.30374 6.16093L0.5 6.61302L4.9486 10.5639L3.55607 16.5L8.5 13.2764M8.5 0.5L10.6963 6.16093L16.5 6.61302L12.0514 10.5639L13.4439 16.5L8.5 13.2764"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
