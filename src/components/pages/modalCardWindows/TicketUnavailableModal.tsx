import { createPortal } from "react-dom";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import useModalStackEntry from "../../../hooks/useModalStackEntry";

interface TicketUnavailableModalProps {
  onClose: () => void;
}

function TicketUnavailableModal({ onClose }: TicketUnavailableModalProps) {
  useLockBodyScroll();
  useModalStackEntry(onClose);

  //todo: make styles for this modal
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-(--bg-secondary) border border-(--bg-border) rounded-xs p-8 text-center flex flex-col gap-4 items-center"
      >
        <p className="text-(--text-primary) font-jbmono">
          Не удалось открыть заявку
        </p>
        <button
          onClick={onClose}
          className="cursor-pointer text-(--text-secondary) hover:text-(--text-primary) font-consolas"
        >
          Закрыть
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default TicketUnavailableModal;
