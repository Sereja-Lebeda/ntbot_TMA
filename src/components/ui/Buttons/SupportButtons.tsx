import { useContext } from "react";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { ThemeContext } from "../../../context/ThemeContext";

import ToggleBtn from "./ToggleBtn";

import { btnPressAnimationStyle } from "../../../styles/pressAnimation";

import TelegramIcon from "../../../icons/card/TelegramIcon";

type BtnMode = "compact" | "static" | "hover";
type ContentBtnType = { className: string; text: string };

const btnStyle: Record<
  BtnMode,
  { theme: ContentBtnType; telegram: ContentBtnType }
> = {
  compact: {
    theme: { className: "w-0", text: "" },
    telegram: { className: "w-37.5", text: "Задать вопрос" },
  },
  static: {
    theme: { className: "w-37.5", text: "Сменить тему" },
    telegram: { className: "w-37.5", text: "Задать вопрос" },
  },
  hover: {
    theme: {
      className: "w-0 overflow-hidden group-hover:w-37.5",
      text: "Сменить тему",
    },
    telegram: {
      className: "w-37.5 overflow-hidden",
      text: "Задать вопрос",
    },
  },
};

function getBtnMode({
  isTouchDevice,
  isMobile,
  isDesktop,
}: {
  isTouchDevice: boolean;
  isMobile: boolean;
  isDesktop: boolean;
}): BtnMode {
  if (isMobile) return "compact";
  if (isDesktop) return isTouchDevice ? "compact" : "hover";
  return "static";
}

function SupportButtons() {
  const { toggleTheme } = useContext(ThemeContext);

  const isTouchDevice = useMediaQuery("(pointer: coarse)");
  const isMobile = useMediaQuery("(max-width: 500px)");
  const isDesktop = useMediaQuery("(min-width:1280px)");

  const mode = getBtnMode({ isTouchDevice, isMobile, isDesktop });
  const { theme, telegram } = btnStyle[mode];

  return (
    // Toggle and telegram block
    <>
      <button
        className={`flex items-center bg-(--bg-primary-second) border border-(--bg-border) hover:border-(--border-hover-btn) select-none
      peer group rounded-xs p-2 ${btnPressAnimationStyle}`}
        onClick={toggleTheme}
      >
        <ToggleBtn />
        <span
          className={`font-jbmono text-(--text-secondary) group-hover:text-(--text-primary) text-sm font-medium leading-normal select-none
        transition-all duration-300 whitespace-nowrap
        ${theme.className}`}
        >
          {theme.text}
        </span>
      </button>

      <button
        className={`w-auto flex justify-center items-center px-3 py-2.5 bg-(--bg-primary-second) border border-(--bg-border) hover:border-(--border-hover-btn) select-none group rounded-xs ${btnPressAnimationStyle}
        ${mode === "hover" ? "peer-hover:[&>span]:w-0" : ""}`}
      >
        <TelegramIcon className="group-hover:text-(--text-primary) text-(--text-secondary)" />
        <span
          className={`font-jbmono text-(--text-secondary) group-hover:text-(--text-primary) text-sm font-medium leading-normal select-none
         transition-all duration-300 whitespace-nowrap
        ${telegram.className}`}
        >
          {telegram.text}
        </span>
      </button>
    </>
  );
}

export default SupportButtons;
