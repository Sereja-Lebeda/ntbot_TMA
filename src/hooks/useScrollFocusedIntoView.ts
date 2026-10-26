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
    let target: HTMLInputElement | HTMLTextAreaElement | null = null;

    function scheduleScroll(delay: number) {
      clearTimeout(timerId);
      timerId = window.setTimeout(
        () =>
          target?.scrollIntoView({
            block: "center",
            behavior: "smooth",
          }),
        delay,
      );
    }

    function handleFocusIn(e: FocusEvent) {
      const field = e.target;
      if (!window.matchMedia("(pointer: coarse)").matches) return;
      if (!isTextField(field)) return;

      target = field;
      scheduleScroll(150);
    }

    function handleViewportResize() {
      if (target === null) return;
      else {
        scheduleScroll(100);
      }
    }

    function handleFocusOut() {
      target = null;
    }

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", handleViewportResize);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      viewport?.removeEventListener("resize", handleViewportResize);
      clearTimeout(timerId);
    };
  }, []);
}

export default useScrollFocusedIntoView;
