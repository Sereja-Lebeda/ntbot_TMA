// libs
// hooks
// internal components
// style
// import styles from "./Button.module.css"

import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

import ToggleIcon from "../../icons/ToggleIcon";

function ToggleBtn() {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <div
      onClick={toggleTheme}
      className="flex items-center cursor-pointer select-none"
    >
      <ToggleIcon />
    </div>
  );
}

export default ToggleBtn;
