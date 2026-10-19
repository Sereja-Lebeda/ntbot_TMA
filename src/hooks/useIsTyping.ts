import { useEffect, useState } from "react";

function isTextField(field: EventTarget | null) {
  return (
    field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement
  );
}

function useIsTyping() {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    function handleFocusIn(e: FocusEvent) {
      setIsTyping(isTextField(e.target));
    }

    function handleFocusOut(e: FocusEvent) {
      setIsTyping(isTextField(e.relatedTarget));
    }

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return isTyping;
}

export default useIsTyping;
