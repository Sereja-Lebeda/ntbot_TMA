import { createPortal } from "react-dom";
import useModalStackEntry from "../../../hooks/useModalStackEntry";

import CheckIcon from "../../../icons/card/CheckIcon";
import CrossIcon from "../../../icons/card/CrossIcon";
import ModalIcon from "../../../icons/createTicket/ModalIcon";
import { useEffect, useRef, useState } from "react";
import { hapticTap } from "../../../utils/haptics";

interface ConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  inputText: string;
  isOpen: boolean;
  isBusy?: boolean;
}

function ConfirmModal({
  onConfirm,
  onCancel,
  inputText,
  isOpen,
  isBusy = false,
}: ConfirmModalProps) {
  useModalStackEntry(onCancel, isOpen);

  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timerId = setTimeout(() => {
        setShouldRender(false);
      }, 400);
      return () => clearTimeout(timerId);
    }

    return;
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return;

    if (isOpen) {
      void modalRef.current?.offsetHeight;
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [shouldRender, isOpen]);

  if (!shouldRender) return null;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex justify-center items-center
    transition-opacity duration-400 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        ref={modalRef}
        className={`h-38.25 w-78 px-8 py-3 gap-2 flex flex-col justify-center items-center bg-(--bg-secondary) border border-(--bg-border) rounded-xs select-none
          transition-all duration-400 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* icon and text */}
        <div className="w-full pt-6 pb-2 flex justify-center items-center gap-3">
          <ModalIcon className="w-6 h-6 text-(--text-primary) shrink-0" />
          <span className="font-consolas font-normal text-(--text-primary) text-xs leading-3 whitespace-pre-line">
            {inputText}
          </span>
        </div>

        {/* buttons */}
        <div className="w-full h-full flex justify-center items-center gap-18">
          <button
            disabled={isBusy}
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="flex justify-center items-center gap-1 py-2.25 cursor-pointer group
            disabled:opacity-50 disabled:cursor-default"
            onPointerDown={hapticTap}
          >
            <CrossIcon className="w-2.5 h-2.5 text-(--text-secondary) group-enabled:group-hover:text-(--text-primary)" />
            <span className="font-bold leading-3 text-xs text-(--text-secondary) group-enabled:group-hover:text-(--text-primary)">
              Нет
            </span>
          </button>

          <button
            disabled={isBusy}
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="flex justify-center items-center gap-1 py-2.25 cursor-pointer group
            disabled:opacity-50 disabled:cursor-default"
            onPointerDown={hapticTap}
          >
            <CheckIcon className="text-(--text-secondary) group-enabled:group-hover:text-(--text-primary)" />
            <span className="font-bold leading-3 text-xs text-(--text-secondary) group-enabled:group-hover:text-(--text-primary)">
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
