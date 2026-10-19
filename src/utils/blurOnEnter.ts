import type { KeyboardEvent } from "react";

function blurOnEnter(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter") e.currentTarget.blur();
}

export default blurOnEnter;
