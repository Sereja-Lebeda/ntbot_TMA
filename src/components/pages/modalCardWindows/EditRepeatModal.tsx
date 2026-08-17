import { createPortal } from "react-dom";
import { useRef, useEffect } from "react";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import useUser from "../../../hooks/useUser";
import useModalStackEntry from "../../../hooks/useModalStackEntry";
import useEditRepeatForm from "../../../hooks/useEditRepeatForm";

import type { Action, PriorityLevel } from "../../../types/createTicket.type";
import type {
  StatusType,
  Ticket,
  TicketAttachmentType,
} from "../../../types/ticket.types";
import TicketForm from "../../TicketForm";

import { getTicketPermissions } from "../../../utils/ticketPermissions";
import getBreadcrumb from "../../../utils/getBreadcrumbs";

import TicketHeaderInfo from "./TicketHeaderInfo";
import ConfirmModal from "./ConfirmModal";
import FormDropdown from "../../ui/FormDropdown";
import EditableAttachmentField from "../../ui/Attachment/EditableAttachmentField";
import AttachmentField from "../../ui/Attachment/AttachmentField";
import FunctionBtn from "../../ui/Buttons/FunctionBtn";

import { shadowLiftButtonStyle } from "../../../styles/shadowLift";

import FloppydiskIcon from "../../../icons/FloppydiskIcon";
import RepeatIcon from "../../../icons/card/RepeatIcon";
import TicketInfoIcon from "../../../icons/card/TicketInfoIcon";
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
    action: Action;
    attachedFiles: TicketAttachmentType;
    status: StatusType;
  }) => void;
  mode: ModeType;

  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
}

type ModeType = "edit" | "repeat";

function EditRepeatModal({
  ticket,
  action,
  onClose,
  onSubmit,
  mode,
  favoriteTickets,
  setFavoriteTickets,
}: EditRepeatModalProps) {
  useLockBodyScroll();

  const {
    formData,
    setFormData,
    multiData,
    setMultiData,
    priority,
    setPriority,
    errors,
    files,
    setFiles,
    editFiles,
    setEditFiles,
    isDragging,
    setIsDragging,
    selectedCategory,
    selectedSubcategory,
    selectedActionState,
    newStatus,
    setNewStatus,
    isConfirmCloseOpen,
    setIsConfirmCloseOpen,
    inputText,
    handleCloseAttempt,
    handleCategoryChange,
    handleSubcategoryChange,
    handleActionChange,
    handleSubmit,
    addFiles,
    addEditFiles,
    clearError,
    setFieldError,
    categoryOptions,
    subcategoryOptions,
    actionOptions,
    currentAction,
    isFormInvalid,
  } = useEditRepeatForm({
    ticket,
    action,
    mode,
    onClose,
    onSubmit,
  });

  const ref = useRef(handleCloseAttempt);
  useEffect(() => {
    ref.current = handleCloseAttempt;
  });
  useModalStackEntry(() => ref.current());

  const currentUser = useUser();

  if (!currentUser || !ticket || !action) return null;
  const permissions = getTicketPermissions(ticket, currentUser);

  //NOTE: comment above to edit modal window with restricted message
  // permissions.canEdit = false;

  if (mode === "edit" && !permissions.canEdit) {
    return createPortal(
      <div
        onClick={onClose}
        className="xl:fixed xl:inset-0 xl:bg-black/50 xl:z-50 xl:flex xl:justify-center xl:items-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="xl:bg-(--bg-secondary) xl:border xl:border-(--bg-border) xl:rounded-xs xl:p-8 xl:text-center xl:flex xl:flex-col xl:gap-4 xl:items-center"
        >
          <p className="xl:text-(--text-primary) xl:font-jbmono">
            У вас нет прав на редактирование этой заявки.<br></br>
            Пожалуйста, обратитесь к администратору.
          </p>
          <button
            onClick={onClose}
            className="xl:cursor-pointer xl:text-(--text-secondary) xl:hover:text-(--text-primary) xl:font-consolas"
          >
            Закрыть
          </button>
        </div>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div
      onClick={handleCloseAttempt}
      className="xl:fixed xl:inset-0 xl:bg-black/50 xl:z-50 xl:flex xl:justify-center xl:items-center"
    >
      {isConfirmCloseOpen && (
        <ConfirmModal
          inputText={inputText}
          onConfirm={() => {
            setIsConfirmCloseOpen(false);
            onClose();
          }}
          onCancel={() => setIsConfirmCloseOpen(false)}
        />
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => {
          const target = e.target as HTMLElement;
          const isFormElement = target.closest("input, textarea, select");
          if (!isFormElement) {
            (document.activeElement as HTMLElement)?.blur();
          }
        }}
        className="xl:w-[50vw] xl:max-h-[90vh] xl:flex xl:flex-col xl:items-center xl:gap-4 xl:bg-(--bg-secondary) xl:border xl:border-(--bg-border) xl:rounded-xs xl:py-10 xl:select-none overflow-y-auto"
      >
        {/* Header */}
        {mode === "edit" ? (
          <div className="xl:w-full xl:gap-7 xl:flex xl:flex-col xl:items-start">
            <TicketHeaderInfo
              favoriteTickets={favoriteTickets}
              setFavoriteTickets={setFavoriteTickets}
              ticket={ticket}
              modalMode="edit"
              onStatusChange={
                permissions.canChangeStatus
                  ? (status) => setNewStatus(status)
                  : undefined
              }
              currentStatus={newStatus}
            />
          </div>
        ) : (
          <div className="xl:w-full xl:flex xl:flex-col xl:justify-center xl:items-start xl:gap-3 xl:px-12.5">
            <div className="xl:w-full xl:flex xl:items-center xl:gap-1">
              <RepeatIcon className="xl:text(--text-secondary) xl:w-4 xl:h-4" />
              <span className="xl:font-consolas xl:font-normal xl:text-xs xl:text-(--text-secondary) xl:leading-4">{`Повтор заявки #${ticket.ticketId}`}</span>
            </div>

            {/* Divider */}
            <div className="xl:w-full xl:h-px xl:bg-(--bg-disable-btn)"></div>
          </div>
        )}

        {/* Content */}
        <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:gap-7 xl:overflow-y-auto dropdown-scroll xl:px-12.5">
          {/* Ticket information */}
          <div className="xl:w-full xl:flex xl:items-start xl:gap-1">
            <TicketInfoIcon className="xl:text-(--text-primary)" />
            <span className="xl:font-jbmono xl:font-normal xl:text-sm xl:text-(--text-primary) xl:leading-5">
              Информация о заявке
            </span>
          </div>
          <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:justify-center xl:gap-8">
            <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:gap-2">
              <span className="xl:font-consolas xl:font-normal xl:text-xs xl:text-(--text-secondary) xl:leading-3">
                Категории
              </span>

              {mode === "repeat" ? (
                <div className="xl:flex xl:justify-start xl:items-center xl:gap-2">
                  {ticket.breadcrumbs.map(getBreadcrumb)}
                </div>
              ) : (
                <div className="xl:w-full xl:flex xl:flex-col xl:gap-3">
                  <FormDropdown
                    options={categoryOptions}
                    value={selectedCategory ?? ""}
                    onChange={handleCategoryChange}
                    placeholder="Выберите категорию"
                  />
                  <FormDropdown
                    options={subcategoryOptions}
                    value={selectedSubcategory ?? ""}
                    onChange={handleSubcategoryChange}
                    placeholder="Выберите подкатегорию"
                    disabled={!selectedCategory}
                  />
                  <FormDropdown
                    options={actionOptions}
                    value={selectedActionState?.name ?? ""}
                    onChange={handleActionChange}
                    placeholder="Выберите действие"
                    disabled={!selectedSubcategory}
                  />
                </div>
              )}
            </div>
          </div>
          <TicketForm
            selectedAction={currentAction ?? null}
            formData={formData}
            setFormData={setFormData}
            multiData={multiData}
            setMultiData={setMultiData}
            priority={priority}
            setPriority={setPriority}
            errors={errors}
            clearError={clearError}
            setFieldError={setFieldError}
          />

          {mode === "edit" ? (
            <EditableAttachmentField
              files={editFiles}
              setFiles={setEditFiles}
              addFiles={addEditFiles}
            />
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setIsDragging(false);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                addFiles(e.dataTransfer.files);
              }}
              className="xl:w-full"
            >
              <AttachmentField
                files={files}
                setFiles={setFiles}
                isDragging={isDragging}
                addFiles={addFiles}
              />
            </div>
          )}

          {/* Divider */}
          <div className="xl:w-full xl:h-px xl:bg-(--bg-disable-btn)"></div>
        </div>

        {/* Buttons */}
        <div className="xl:w-full xl:flex xl:justify-between xl:items-center xl:px-12.5">
          {/* Back btn */}
          <button
            onClick={handleCloseAttempt}
            className="xl:flex xl:justify-center xl:items-center xl:gap-1 xl:py-2.25 xl:cursor-pointer xl:group"
          >
            <CrossIcon className="xl:text-(--text-secondary) xl:group-hover:text-(--text-primary) xl:w-2.25 xl:h-2.25" />
            <span className="xl:font-jbmono xl:font-medium xl:text-(--text-secondary) xl:text-xs xl:leading-normal xl:group-hover:text-(--text-primary)">
              Отмена
            </span>
          </button>

          {/* Send ticket btn */}
          <FunctionBtn
            Icon={mode === "edit" ? FloppydiskIcon : SendFormIcon}
            iconClassName="xl:w-4.5 xl:h-4.5 xl:text-(--text-btn)"
            text={mode === "edit" ? "Сохранить" : "Отправить заявку"}
            textClassName="xl:font-jbmono xl:font-medium xl:text-xs xl:text-(--text-btn) xl:leading-normal"
            innerDivClassName="xl:flex xl:justify-center xl:items-center xl:gap-2"
            btnClassName={`
              xl:h-8.5 xl:px-4 xl:rounded-xs xl:group
              ${shadowLiftButtonStyle}
              xl:enabled:bg-(--bg-btn-primary)
              `}
            onClick={handleSubmit}
            disabled={isFormInvalid}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default EditRepeatModal;
