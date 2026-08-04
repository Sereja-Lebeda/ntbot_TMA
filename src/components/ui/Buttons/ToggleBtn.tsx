// libs
// hooks
// internal components
// style
// import styles from "./Button.module.css"

import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

import ToggleDarkIcon from "../../../icons/ToggleDarkIcon";
import ToggleLightIcon from "../../../icons/ToggleLightIcon";

function ToggleBtn() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="xl:flex xl:items-center xl:cursor-pointer xl:select-none">
      {theme === "light" ? <ToggleDarkIcon /> : <ToggleLightIcon />}
    </div>
  );
}

export default ToggleBtn;
