import { createPortal } from "react-dom";
import useModalStackEntry from "../../../hooks/useModalStackEntry";

import CheckIcon from "../../../icons/card/CheckIcon";
import CrossIcon from "../../../icons/card/CrossIcon";
import ModalIcon from "../../../icons/createTicket/ModalIcon";

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  inputText: string;
}

function ConfirmModal({ onConfirm, onCancel, inputText }: ConfirmModalProps) {
  useModalStackEntry(onCancel);

  return createPortal(
    <div
      className="xl:fixed xl:inset-0 xl:bg-black/50 xl:z-50 xl:flex xl:justify-center xl:items-center"
    >
      <div
        className="xl:h-38.25 xl:w-78 xl:px-8 xl:py-3 xl:gap-2 xl:flex xl:flex-col xl:justify-center xl:items-center xl:bg-(--bg-secondary) xl:border xl:border-(--bg-border) xl:rounded-xs xl:select-none"
      >
        {/* icon and text */}
        <div
          className="xl:w-full xl:pt-6 xl:pb-2 xl:flex xl:justify-center xl:items-center xl:gap-3"
        >
          <ModalIcon className="xl:w-6 xl:h-6 xl:text-(--text-primary) xl:shrink-0" />
          <span
            className="xl:font-consolas xl:font-normal xl:text-(--text-primary) xl:text-xs xl:leading-3 xl:whitespace-pre-line"
          >
            {inputText}
          </span>
        </div>

        {/* buttons */}
        <div className="xl:w-full xl:h-full xl:flex xl:justify-center xl:items-center xl:gap-18">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="xl:flex xl:justify-center xl:items-center xl:gap-1 xl:py-2.25 xl:cursor-pointer xl:group"
          >
            <CrossIcon className="xl:w-2.5 xl:h-2.5 xl:text-(--text-secondary) xl:group-hover:text-(--text-primary)" />
            <span className="xl:font-bold xl:leading-3 xl:text-xs xl:text-(--text-secondary) xl:group-hover:text-(--text-primary)">
              Нет
            </span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="xl:flex xl:justify-center xl:items-center xl:gap-1 xl:py-2.25 xl:cursor-pointer xl:group"
          >
            <CheckIcon className="xl:text-(--text-secondary) xl:group-hover:text-(--text-primary)" />
            <span className="xl:font-bold xl:leading-3 xl:text-xs xl:text-(--text-secondary) xl:group-hover:text-(--text-primary)">
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
