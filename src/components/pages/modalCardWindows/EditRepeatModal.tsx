import { createPortal } from "react-dom";
import { useState } from "react";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import useEscapeKey from "../../../hooks/useEscapeKey";

import type {
  Action,
  AttachedFile,
  Field,
  PriorityLevel,
} from "../../../types/createTicket.type";
import type { Ticket } from "../../../types/ticket.types";

import getBreadcrumb from "../../../utils/getBreadcrumbs";
import validateForm from "../../../utils/validateForm";
import RepeatIcon from "../../../icons/card/RepeatIcon";
import TicketInfoIcon from "../../../icons/card/TicketInfoIcon";
import TicketForm from "../../TicketForm";
import CrossIcon from "../../../icons/card/CrossIcon";
import SendFormIcon from "../../../icons/createTicket/SendFormIcon";

interface EditRepeatModalProps {
  ticket: Ticket | undefined;
  action: Action | undefined;

  onClose: () => void;
  onSubmit: (data: {
    formData: Record<string, string>;
    multiData: Record<string, string[]>;
    priority: PriorityLevel;
  }) => void;
  mode: ModeType;
}

type ModeType = "edit" | "repeat";

function EditRepeatModal({
  ticket,
  action,
  onClose,
  onSubmit,
  mode,
}: EditRepeatModalProps) {
  useLockBodyScroll();
  useEscapeKey(onClose);

  const [formData, setFormData] = useState<Record<string, string>>(
    ticket?.body ?? {},
  );
  const [multiData, setMultiData] = useState<Record<string, string[]>>(
    ticket?.multiBody ?? {},
  );
  const [priority, setPriority] = useState<PriorityLevel>(
    ticket?.priority ?? null,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<AttachedFile[]>([]);

  if (!ticket || !action) return null;

  function clearError(field: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleSubmit() {
    const newErrors = validateForm(formData, multiData, priority, action);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSubmit({ formData, multiData, priority });
  }

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0
  bg-black/50 z-50
  flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          const isFormElement = target.closest("input, textarea, select");
          if (!isFormElement) {
            (document.activeElement as HTMLElement)?.blur();
          }
        }}
        className="w-[50vw] max-h-[90vh] flex flex-col items-center gap-7
      bg-(--bg-secondary) border border-(--bg-border) rounded-xs px-12.5 py-10 select-none
      "
      >
        {/* Header */}
        <div className="w-full flex flex-col justify-center items-start gap-3">
          <div className="w-full flex items-center gap-1">
            <RepeatIcon className="text(--text-secondary) w-4 h-4" />
            <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-4">{`Повтор заявки #${ticket.ticketId}`}</span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-(--bg-disable-btn)"></div>
        </div>

        {/* Content */}
        <div className="w-full flex flex-col items-start gap-7 overflow-y-auto dropdown-scroll">
          {/* Ticket information */}
          <div className="w-full flex items-start gap-1">
            <TicketInfoIcon className="text-(--text-primary)" />
            <span className="font-jbmono font-normal text-sm text-(--text-primary) leading-5">
              Информация о заявке
            </span>
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-8">
            <div className="w-full flex flex-col items-start gap-2">
              <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-3">
                Категории
              </span>
              {/* Bread crumbs */}
              <div className="flex justify-start items-center gap-2">
                {ticket.breadcrumbs.map(getBreadcrumb)}
              </div>
            </div>
          </div>
          <TicketForm
            selectedAction={action}
            formData={formData}
            setFormData={setFormData}
            multiData={multiData}
            setMultiData={setMultiData}
            priority={priority}
            setPriority={setPriority}
            files={files}
            setFiles={setFiles}
            errors={errors}
            clearError={clearError}
          />

          {/* Divider */}
          <div className="w-full h-px bg-(--bg-disable-btn) my-"></div>
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-between items-center">
          {/* Back btn */}
          <button
            onClick={onClose}
            className="flex justify-center items-center gap-1 py-2.25 cursor-pointer group"
          >
            <CrossIcon className="text-(--text-secondary) group-hover:text-(--text-primary) w-2.25 h-2.25" />
            <span className="font-jbmono font-medium text-(--text-secondary) text-xs leading-normal group-hover:text-(--text-primary)">
              Отмена
            </span>
          </button>

          {/* Send ticket btn */}
          {/* White background */}
          <button
            onClick={handleSubmit}
            className="h-8.5 flex justify-center items-center
            bg-(--text-primary) rounded-xs cursor-pointer group"
          >
            <div
              className="h-8.5 flex justify-center items-center gap-2
              bg-(--bg-btn-primary) rounded-xs px-4
              transition-all duration-600 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:z-10"
            >
              <SendFormIcon className="w-4.5 h-4.5 text-(--text-btn)" />
              <span className="font-jbmono font-medium text-xs text-(--text-btn) leading-normal">
                Отправить заявку
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default EditRepeatModal;
