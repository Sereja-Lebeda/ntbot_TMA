interface CardActionButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function CardActionButton({
  onClick,
  className,
  children,
}: CardActionButtonProps) {
  return (
    <button
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}
