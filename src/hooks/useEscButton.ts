import useModalStackEntry from "./useModalStackEntry";

export default function useEscButton(onClose: () => void) {
  useModalStackEntry(onClose);
}
