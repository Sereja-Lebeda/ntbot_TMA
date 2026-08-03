import { useContext } from "react";
import { ModalStackContext } from "../context/ModalStackContext";

function useModalStack() {
  const ctx = useContext(ModalStackContext);
  if (!ctx) throw new Error("ModalStackContext is null");
  return ctx;
}

export default useModalStack;
