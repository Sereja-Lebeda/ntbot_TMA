import CrossIcon from "../../../icons/card/CrossIcon";

interface CancelFormButtonProps {
  onClick: () => void;
  isDesktop?: boolean; // если true — классы с xl:-префиксом
}

function CancelFormButton({ onClick, isDesktop }: CancelFormButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        isDesktop
          ? "xl:flex xl:justify-center xl:items-center xl:gap-1 xl:py-2.25 xl:cursor-pointer xl:group"
          : "flex justify-center items-center gap-1 py-2.25 cursor-pointer group"
      }
    >
      <CrossIcon
        className={
          isDesktop
            ? "xl:text-(--text-secondary) xl:group-hover:text-(--text-primary) xl:w-2.25 xl:h-2.25"
            : "text-(--text-secondary) group-hover:text-(--text-primary) w-2.25 h-2.25"
        }
      />
      <span
        className={
          isDesktop
            ? "xl:font-jbmono xl:font-medium xl:text-(--text-secondary) xl:text-xs xl:leading-normal xl:group-hover:text-(--text-primary)"
            : "font-jbmono font-medium text-(--text-secondary) text-xs leading-normal group-hover:text-(--text-primary)"
        }
      >
        Отмена
      </span>
    </button>
  );
}

export default CancelFormButton;
