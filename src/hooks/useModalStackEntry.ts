import { useEffect, useRef } from "react";
import useModalStack from "./useModalStack";

function useModalStackEntry(onClose: () => void, enabled: boolean = true) {
  const modalStack = useModalStack();
  const ref = useRef(onClose);

  useEffect(() => {
    ref.current = onClose;
  });

  useEffect(() => {
    if (!enabled) return;

    const stableCallback = () => ref.current();
    modalStack.addStackEl(stableCallback);

    return () => {
      modalStack.removeStackEl(stableCallback);
    };
  }, [enabled]);
}

export default useModalStackEntry;
