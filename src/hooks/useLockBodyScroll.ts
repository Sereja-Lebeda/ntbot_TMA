import { useEffect } from "react";

function useLockBodyScroll() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
}

export default useLockBodyScroll;
