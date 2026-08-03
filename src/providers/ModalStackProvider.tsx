import { useEffect, useState } from "react";
import { ModalStackContext } from "../context/ModalStackContext";

function ModalStackProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<(() => void)[]>([]);

  function addStackEl(newEl: () => void) {
    setStack((prev) => [...prev, newEl]);
  }

  function removeStackEl(oldEl: () => void) {
    setStack((prev) => prev.filter((p) => p !== oldEl));
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (stack.length === 0) {
          return;
        }
        const lastStackEl = stack[stack.length - 1];
        lastStackEl();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [stack]);

  return (
    <ModalStackContext.Provider value={{ stack, addStackEl, removeStackEl }}>
      {children}
    </ModalStackContext.Provider>
  );
}

export default ModalStackProvider;
