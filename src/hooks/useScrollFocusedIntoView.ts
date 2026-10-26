import { useEffect } from "react";

function isTextField(
  field: EventTarget | null,
): field is HTMLInputElement | HTMLTextAreaElement {
  return (
    field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
  );
}

function useScrollFocusedIntoView() {
  useEffect(() => {
    let timerId: number | undefined;

    function handleFocusIn(e: FocusEvent) {
      clearTimeout(timerId);

      const target = e.target;
      if (!isTextField(target)) return;
      if (!window.matchMedia("(pointer: coarse)").matches) return;

      timerId = window.setTimeout(() => {
        target.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 400);
    }

    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      clearTimeout(timerId);
    };
  }, []);
}

export default useScrollFocusedIntoView;
