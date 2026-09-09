import { btnPressAnimationStyle } from "../../../styles/pressAnimation";
import ToggleBtn from "./ToggleBtn";

import TelegramIcon from "../../../icons/card/TelegramIcon";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

function SupportButtons() {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    // Toggle and telegram block
    <>
      <button
        className={`flex items-center bg-(--bg-primary-second) border border-(--bg-border) hover:border-(--border-hover-btn) select-none
      group rounded-xs p-2 ${btnPressAnimationStyle}`}
        onClick={toggleTheme}
      >
        <ToggleBtn />
        <span
          className="font-jbmono text-(--text-secondary) group-hover:text-(--text-primary) text-sm font-medium leading-normal select-none
        w-0 overflow-hidden group-hover:w-37.5 transition-all duration-300 whitespace-nowrap"
        >
          Сменить тему
        </span>
      </button>

      <button
        className={`w-auto flex justify-center items-center px-3 py-2.5 bg-(--bg-primary-second) border border-(--bg-border) hover:border-(--border-hover-btn) select-none group rounded-xs ${btnPressAnimationStyle}`}
      >
        <TelegramIcon className="group-hover:text-(--text-primary) text-(--text-secondary)" />
        <span
          className="font-jbmono text-(--text-secondary) group-hover:text-(--text-primary) text-sm font-medium leading-normal select-none
        w-0 overflow-hidden group-hover:w-37.5 transition-all duration-300 whitespace-nowrap"
        >
          Задать вопрос
        </span>
      </button>
    </>
  );
}

export default SupportButtons;
