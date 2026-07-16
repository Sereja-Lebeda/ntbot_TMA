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
      </button>

      <button
        className={`w-full flex justify-center items-center px-3 py-2.5 bg-(--bg-primary-second) border border-(--bg-border) hover:border-(--border-hover-btn) select-none group rounded-xs gap-2 ${btnPressAnimationStyle}`}
      >
        <TelegramIcon className="group-hover:text-(--text-primary) text-(--text-secondary) " />
        <span className="font-jbmono text-(--text-secondary) group-hover:text-(--text-primary) text-sm font-medium leading-normal select-none">
          Задать вопрос
        </span>
      </button>
    </>
  );
}

export default SupportButtons;
