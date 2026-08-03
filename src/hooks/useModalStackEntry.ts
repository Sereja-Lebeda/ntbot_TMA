import { useEffect } from "react";
import useModalStack from "./useModalStack";

function useModalStackEntry(onClose: () => void) {
  const modalStack = useModalStack();

  useEffect(() => {
    modalStack.addStackEl(onClose);

    return () => {
      modalStack.removeStackEl(onClose);
    };
  }, []);
}

export default useModalStackEntry;
