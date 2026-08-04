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
        className={`xl:flex items-center xl:bg-(--bg-primary-second) xl:border xl:border-(--bg-border) xl:hover:border-(--border-hover-btn) xl:select-none
      xl:group xl:rounded-xs xl:p-2 ${btnPressAnimationStyle}`}
        onClick={toggleTheme}
      >
        <ToggleBtn />
      </button>

      <button
        className={`xl:w-full xl:flex xl:justify-center xl:items-center xl:px-3 xl:py-2.5 xl:bg-(--bg-primary-second) xl:border xl:border-(--bg-border) xl:hover:border-(--border-hover-btn) xl:select-none xl:group xl:rounded-xs xl:gap-2 ${btnPressAnimationStyle}`}
      >
        <TelegramIcon className="xl:group-hover:text-(--text-primary) xl:text-(--text-secondary) " />
        <span className="xl:font-jbmono xl:text-(--text-secondary) xl:group-hover:text-(--text-primary) xl:text-sm xl:font-medium xl:leading-normal xl:select-none">
          Задать вопрос
        </span>
      </button>
    </>
  );
}

export default SupportButtons;
