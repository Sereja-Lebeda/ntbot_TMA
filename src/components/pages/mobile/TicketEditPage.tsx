import { useNavigate, useOutletContext, useParams } from "react-router";
import useTicketAndAction from "../../../hooks/useTicketAndAction";
import useUser from "../../../hooks/useUser";
import useEditRepeatForm from "../../../hooks/useEditRepeatForm";
import useMediaQuery from "../../../hooks/useMediaQuery";

import type {
  StatusType,
  Ticket,
  TicketAttachmentType,
} from "../../../types/ticket.types";
import type { Action, PriorityLevel } from "../../../types/createTicket.type";

import { allActions } from "../../../utils/allActions";
import { getTicketPermissions } from "../../../utils/ticketPermissions";

import TicketHeaderInfo from "../modalCardWindows/TicketHeaderInfo";
import ConfirmModal from "../modalCardWindows/ConfirmModal";
import TicketForm from "../../TicketForm";
import FormDropdown from "../../ui/FormDropdown";
import EditableAttachmentField from "../../ui/Attachment/EditableAttachmentField";
import FunctionBtn from "../../ui/Buttons/FunctionBtn";

import { shadowLiftButtonStyle } from "../../../styles/shadowLift";

import TicketInfoIcon from "../../../icons/card/TicketInfoIcon";
import CrossIcon from "../../../icons/card/CrossIcon";
import FloppydiskIcon from "../../../icons/FloppydiskIcon";
import useEscButton from "../../../hooks/useEscButton";

interface OutletContextProps {
  tickets: Ticket[];
  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
  handleEditSubmit(
    data: {
      formData: Record<string, string>;
      multiData: Record<string, string[]>;
      priority: PriorityLevel;
      action: Action;
      attachedFiles: TicketAttachmentType;
      status: StatusType;
    },
    editTicket: Ticket | undefined,
  ): void;
}

function TicketEditPage() {
  const currentUser = useUser();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 500px)");

  const params = useParams<{ ticketId: string }>();
  const ticketId = Number(params.ticketId);

  const { tickets, favoriteTickets, setFavoriteTickets, handleEditSubmit } =
    useOutletContext<OutletContextProps>();

  const { ticket: editedTicket, action: editedAction } = useTicketAndAction({
    ticketId,
    tickets,
    allActions,
  });

  function onClose() {
    return navigate(-1);
  }

  const {
    formData,
    setFormData,
    multiData,
    setMultiData,
    priority,
    setPriority,
    errors,
    editFiles,
    setEditFiles,
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
    addEditFiles,
    clearError,
    setFieldError,
    categoryOptions,
    subcategoryOptions,
    actionOptions,
    currentAction,
    isFormInvalid,
  } = useEditRepeatForm({
    ticket: editedTicket,
    action: editedAction,
    mode: "edit",
    onClose,
    onSubmit: (data) => {
      handleEditSubmit(data, editedTicket);
      onClose();
    },
  });

  useEscButton(handleCloseAttempt);

  if (!currentUser || !editedTicket || !editedAction) return null;
  const permissions = getTicketPermissions(editedTicket, currentUser);

  // permissions.canEdit = false;

  if (!permissions.canEdit) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 select-none">
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
      </div>
    );
  }

  return (
    <div className="px-2">
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
        className={`w-full h-full max-w-200 mx-auto py-6 px-5
        flex flex-col items-center gap-4
        bg-(--bg-secondary) border border-(--bg-border)
        select-none overflow-y-auto
        ${isDesktop ? "mt-2 mb-2" : "mt-17 mb-22"}
    `}
      >
        <div className="w-full gap-7 flex flex-col items-start">
          <TicketHeaderInfo
            favoriteTickets={favoriteTickets}
            setFavoriteTickets={setFavoriteTickets}
            ticket={editedTicket}
            modalMode="edit"
            onStatusChange={
              permissions.canChangeStatus
                ? (status) => setNewStatus(status)
                : undefined
            }
            currentStatus={newStatus}
          />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-(--bg-border)"></div>

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

          <EditableAttachmentField
            files={editFiles}
            setFiles={setEditFiles}
            addFiles={addEditFiles}
          />

          {/* Divider */}
          <div className="w-full h-px bg-(--bg-disable-btn)"></div>
        </div>

        {/* Buttons */}
        <div className="w-full flex justify-between items-center ">
          {/* Back btn */}
          <button
            onClick={handleCloseAttempt}
            className="flex justify-center items-center gap-1 py-2.25 cursor-pointer group"
          >
            <CrossIcon className="text-(--text-secondary) group-hover:text-(--text-primary) w-2.25 h-2.25" />
            <span className="font-jbmono font-medium text-(--text-secondary) text-xs leading-normal group-hover:text-(--text-primary)">
              Отмена
            </span>
          </button>

          {/* Send ticket btn */}
          {isMobile ? (
            <FunctionBtn
              Icon={FloppydiskIcon}
              iconClassName="w-4.5 h-4.5 text-(--text-btn)"
              textClassName="font-jbmono font-medium text-xs text-(--text-btn) leading-normal"
              innerDivClassName="flex justify-center items-center"
              btnClassName={`
              h-8.5 px-3 rounded-xs group
              ${shadowLiftButtonStyle}
              enabled:bg-(--bg-btn-primary)
              disabled:bg-(--bg-disable-btn)
              `}
              onClick={handleSubmit}
              disabled={isFormInvalid}
            />
          ) : (
            <FunctionBtn
              Icon={FloppydiskIcon}
              iconClassName="w-4.5 h-4.5 text-(--text-btn)"
              text={"Сохранить"}
              textClassName="font-jbmono font-medium text-xs text-(--text-btn) leading-normal"
              innerDivClassName="flex justify-center items-center gap-2"
              btnClassName={`
              h-8.5 px-4 rounded-xs group
              ${shadowLiftButtonStyle}
              enabled:bg-(--bg-btn-primary)
              disabled:bg-(--bg-disable-btn)
              `}
              onClick={handleSubmit}
              disabled={isFormInvalid}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketEditPage;
