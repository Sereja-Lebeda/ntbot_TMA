import { createContext } from "react";

interface ModalStackType {
  stack: (() => void)[];
  addStackEl: (fn: () => void) => void;
  removeStackEl: (fn: () => void) => void;
}

export const ModalStackContext = createContext<ModalStackType | null>(null);
