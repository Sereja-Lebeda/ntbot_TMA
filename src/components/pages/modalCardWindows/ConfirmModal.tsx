import { createPortal } from "react-dom";

import CheckIcon from "../../../icons/card/CheckIcon";
import CrossIcon from "../../../icons/card/CrossIcon";
import ModalIcon from "../../../icons/createTicket/ModalIcon";

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  inputText: string;
}

function ConfirmModal({ onConfirm, onCancel, inputText }: ConfirmModalProps) {
  return createPortal(
    <div
      className="fixed inset-0
  bg-black/50 z-50
  flex justify-center items-center"
    >
      <div
        className="h-38.25 w-78 px-8 py-3 gap-2
      flex flex-col justify-center items-center
      bg-(--bg-secondary)
      border border-(--bg-border) rounded-xs
      select-none"
      >
        {/* icon and text */}
        <div
          className="w-full pt-6 pb-2
        flex justify-center items-center gap-3"
        >
          <ModalIcon className="w-6 h-6 text-(--text-primary) shrink-0" />
          <span
            className="font-consolas font-normal
          text-(--text-primary) text-xs leading-3
          whitespace-pre-line"
          >
            {inputText}
          </span>
        </div>

        {/* buttons */}
        <div className="w-full h-full flex justify-center items-center gap-18">
          <button
            onClick={onCancel}
            className="
          flex justify-center items-center gap-1 py-2.25
          cursor-pointer
          group"
          >
            <CrossIcon className="w-2.5 h-2.5 text-(--text-secondary) group-hover:text-(--text-primary)" />
            <span className="font-bold leading-3 text-xs text-(--text-secondary) group-hover:text-(--text-primary)">
              Нет
            </span>
          </button>

          <button
            onClick={onConfirm}
            className="
          flex justify-center items-center gap-1 py-2.25
          cursor-pointer
          group"
          >
            <CheckIcon className="text-(--text-secondary) group-hover:text-(--text-primary)" />
            <span className="font-bold leading-3 text-xs text-(--text-secondary) group-hover:text-(--text-primary)">
              Да
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ConfirmModal;
