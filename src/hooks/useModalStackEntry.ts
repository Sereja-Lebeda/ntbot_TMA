import { useEffect, useRef } from "react";
import useModalStack from "./useModalStack";

function useModalStackEntry(onClose: () => void) {
  const modalStack = useModalStack();
  const ref = useRef(onClose);

  useEffect(() => {
    ref.current = onClose;
  });

  useEffect(() => {
    const stableCallback = () => ref.current();
    modalStack.addStackEl(stableCallback);

    return () => {
      modalStack.removeStackEl(stableCallback);
    };
  }, []);
}

export default useModalStackEntry;
