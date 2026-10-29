import type { ListStateVariant } from "../../types/listState.types";
import { shadowLiftButtonStyle } from "../../styles/shadowLift";
import FunctionBtn from "./Buttons/FunctionBtn";
import RepeatIcon from "../../icons/card/RepeatIcon";

interface ListStateMessageProps {
  variant: ListStateVariant;
  onRetry?: () => void;
}

const textStyle = "font-consolas text-sm font-bold select-none";

const STATE_MAP: Record<ListStateVariant, string> = {
  loading: "Загрузка...",
  error: "Не удалось загрузить данные",
  unauthorized: "Сессия истекла, откройте приложение заново",
  empty: "У вас пока нет заявок",
  emptyFiltered: "По выбранным фильтрам ничего не найдено",
  ticketNotFound: "Заявка не найдена или недоступна",
  actionNotFound: "Не удалось открыть заявку",
};

function ListStateMessage({ variant, onRetry }: ListStateMessageProps) {
  return (
    <div
      className="w-full h-full
  flex flex-col items-center justify-center gap-4 text-center "
    >
      <span
        className={`
  ${variant === "error" || variant === "unauthorized" ? "text-(--bg-task-error)" : "text-(--text-secondary)"}
  ${textStyle}
  `}
      >
        {STATE_MAP[variant]}
      </span>

      {variant === "error" && onRetry && (
        <FunctionBtn
          Icon={RepeatIcon}
          iconClassName={
            "w-5 h-5 dark:text-(--bg-primary) text-(--text-primary) hover:dark:text-(--bg-primary) hover:text-(--text-primary)"
          }
          text={"Повторить"}
          textClassName={
            "text-sm dark:text-(--bg-primary) text-(--text-primary) font-jbmono font-extrabold select-none"
          }
          btnClassName={`h-10 w-47.5 rounded-xs flex justify-center items-center px-6 py-3 gap-2
              ${shadowLiftButtonStyle}
              enabled:bg-(--bg-btn-primary)`}
          innerDivClassName={"flex items-center gap-1"}
          onClick={onRetry}
        />
      )}
    </div>
  );
}

export default ListStateMessage;
