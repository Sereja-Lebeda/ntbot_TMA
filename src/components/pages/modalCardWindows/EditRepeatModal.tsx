import { createPortal } from "react-dom";
import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import useUser from "../../../hooks/useUser";
import useModalStackEntry from "../../../hooks/useModalStackEntry";
import useEditRepeatForm from "../../../hooks/useEditRepeatForm";
import useMediaQuery from "../../../hooks/useMediaQuery";

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
import CancelFormButton from "../../ui/Buttons/CancelFormButton";

import { shadowLiftButtonStyle } from "../../../styles/shadowLift";

import FloppydiskIcon from "../../../icons/FloppydiskIcon";
import RepeatIcon from "../../../icons/card/RepeatIcon";
import TicketInfoIcon from "../../../icons/card/TicketInfoIcon";
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

  useModalStackEntry(handleCloseAttempt);

  const currentUser = useUser();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 500px)");

  if (!currentUser || !ticket || !action) return null;
  const permissions = getTicketPermissions(ticket, currentUser);

  //NOTE: comment above to edit modal window with restricted message
  // permissions.canEdit = false;

  if (mode === "edit" && !permissions.canEdit) {
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
            У вас нет прав на редактирование этой заявки.<br></br>
            Пожалуйста, обратитесь к администратору.
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

  return createPortal(
    <div
      onClick={handleCloseAttempt}
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
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
        className="w-[85vw] xl:max-w-275 max-h-[85vh] flex flex-col items-center gap-4 bg-(--bg-secondary) border border-(--bg-border) rounded-xs py-10 select-none overflow-y-auto"
      >
        {/* Header */}
        {mode === "edit" ? (
          <div
            className={`w-full xl:gap-7 xl:flex xl:flex-col xl:items-start
          ${!isDesktop && "px-12.5"}`}
          >
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
          <div className="w-full flex flex-col justify-center items-start gap-3 px-12.5">
            <div className="w-full flex items-center gap-1">
              <RepeatIcon className="text(--text-secondary) w-4 h-4" />
              <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-4">{`Повтор заявки #${ticket.ticketId}`}</span>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-(--bg-disable-btn)"></div>
          </div>
        )}

        {/* Content */}
        <div className="w-full flex flex-col items-start gap-7 overflow-y-auto dropdown-scroll px-12.5">
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

              {mode === "repeat" ? (
                <div className="flex justify-start items-center gap-2">
                  {ticket.breadcrumbs.map(getBreadcrumb)}
                </div>
              ) : (
                <div className="w-full flex flex-col gap-3">
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
              className="w-full"
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
          <div className="w-full h-px bg-(--bg-disable-btn)"></div>
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-between items-center px-12.5">
          {/* Back btn */}

          <CancelFormButton
            onClick={handleCloseAttempt}
            isDesktop={isDesktop}
          />

          {/* Send ticket btn */}
          {isMobile ? (
            <FunctionBtn
              Icon={mode === "edit" ? FloppydiskIcon : SendFormIcon}
              iconClassName="w-4.5 h-4.5 text-(--text-btn)"
              textClassName="font-jbmono font-medium text-xs text-(--text-btn) leading-normal"
              innerDivClassName="flex justify-center items-center"
              btnClassName={`
              h-8.5 px-4 rounded-xs group
              ${shadowLiftButtonStyle}
              enabled:bg-(--bg-btn-primary)
              `}
              onClick={handleSubmit}
              disabled={isFormInvalid}
            />
          ) : (
            <FunctionBtn
              Icon={mode === "edit" ? FloppydiskIcon : SendFormIcon}
              iconClassName="w-4.5 h-4.5 text-(--text-btn)"
              text={mode === "edit" ? "Сохранить" : "Отправить заявку"}
              textClassName="font-jbmono font-medium text-xs text-(--text-btn) leading-normal"
              innerDivClassName="flex justify-center items-center gap-2"
              btnClassName={`
              h-8.5 px-4 rounded-xs group
              ${shadowLiftButtonStyle}
              enabled:bg-(--bg-btn-primary)
              `}
              onClick={handleSubmit}
              disabled={isFormInvalid}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default EditRepeatModal;
