interface CardActionButtonProps {
  onClick?: () => void;
  className?: string;
  text?: string | null;
  textClassName?: string;
  children: React.ReactNode;
}

export default function CardActionButton({
  onClick,
  className,
  text,
  textClassName,
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
      <div>{children}</div>
      {text && <p className={textClassName}>{text}</p>}
    </button>
  );
}
