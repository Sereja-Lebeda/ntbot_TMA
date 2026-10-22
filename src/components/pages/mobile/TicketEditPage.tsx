import { useNavigate, useOutletContext, useParams } from "react-router";
import useTicketAndAction from "../../../hooks/useTicketAndAction";
import useUser from "../../../hooks/useUser";
import useEditRepeatForm from "../../../hooks/useEditRepeatForm";
import useMediaQuery from "../../../hooks/useMediaQuery";

import type { Ticket, TicketAttachmentType } from "../../../types/ticket.types";
import type { Action, PriorityLevel } from "../../../types/createTicket.type";

import { allActions } from "../../../utils/allActions";
import { getTicketPermissions } from "../../../utils/ticketPermissions";

import TicketHeaderInfo from "../modalCardWindows/TicketHeaderInfo";
import ConfirmModal from "../modalCardWindows/ConfirmModal";
import TicketForm from "../../TicketForm";

import EditableAttachmentField from "../../ui/Attachment/EditableAttachmentField";
import FunctionBtn from "../../ui/Buttons/FunctionBtn";

import { shadowLiftButtonStyle } from "../../../styles/shadowLift";

import TicketInfoIcon from "../../../icons/card/TicketInfoIcon";
import FloppydiskIcon from "../../../icons/FloppydiskIcon";
import useEscButton from "../../../hooks/useEscButton";
import CancelFormButton from "../../ui/Buttons/CancelFormButton";
import { hapticTap } from "../../../utils/haptics";
import getTicketPageState from "../../../utils/getTicketPageState";
import ListStateMessage from "../../ui/ListStateMessage";
import getBreadcrumb from "../../../utils/getBreadcrumbs";

interface TicketEditFormProps {
  ticket: Ticket;
  action: Action;
  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
  handleEditSubmit: OutletContextProps["handleEditSubmit"];
}

interface OutletContextProps {
  tickets: Ticket[];
  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
  handleEditSubmit(
    data: {
      formData: Record<string, string>;
      multiData: Record<string, string[]>;
      priority: PriorityLevel;

      attachedFiles: TicketAttachmentType;
    },
    editTicket: Ticket | undefined,
  ): Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
}

function TicketEditForm({
  ticket: editedTicket,
  action: editedAction,
  favoriteTickets,
  setFavoriteTickets,
  handleEditSubmit,
}: TicketEditFormProps) {
  const { user: currentUser } = useUser();

  const navigate = useNavigate();
  // const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 500px)");

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

    isConfirmCloseOpen,
    setIsConfirmCloseOpen,
    inputText,
    handleCloseAttempt,

    handleSubmit,
    addEditFiles,
    clearError,
    setFieldError,

    currentAction,
    isFormInvalid,
    isSubmitting,
  } = useEditRepeatForm({
    ticket: editedTicket,
    action: editedAction,
    mode: "edit",
    onClose,
    onSubmit: async (data) => {
      const isSaved = await handleEditSubmit(data, editedTicket);
      if (isSaved) onClose();
    },
  });

  useEscButton(handleCloseAttempt);

  if (!currentUser) return null;
  const permissions = getTicketPermissions(editedTicket, currentUser);

  // permissions.canEdit = false;

  if (!permissions.canEdit) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 select-none">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="bg-(--bg-secondary) border border-(--bg-border) rounded-xs p-8 text-center flex flex-col gap-4 items-center"
        >
          <p className="text-(--text-primary) font-jbmono">
            У вас нет прав на редактирование этой заявки.<br></br>
            Пожалуйста, обратитесь к администратору.
          </p>
          <button
            onClick={() => {
              hapticTap();
              onClose();
            }}
            className="cursor-pointer text-(--text-secondary) hover:text-(--text-primary) font-consolas"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col px-1.5">
      <ConfirmModal
        isOpen={isConfirmCloseOpen}
        inputText={inputText}
        onConfirm={() => {
          setIsConfirmCloseOpen(false);
          onClose();
        }}
        onCancel={() => setIsConfirmCloseOpen(false)}
      />

      <div
        className={`w-full h-full min-h-0 max-w-200 mx-auto py-6 px-5
        flex flex-col items-center gap-4
        bg-(--bg-secondary) border border-(--bg-border)
        select-none 
        mt-2 mb-2
    `}
      >
        <div className="w-full gap-7 flex flex-col items-start">
          <TicketHeaderInfo
            favoriteTickets={favoriteTickets}
            setFavoriteTickets={setFavoriteTickets}
            ticket={editedTicket}
            modalMode="edit"
            currentStatus={editedTicket.status}
          />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-(--bg-border)"></div>

        {/* Content */}
        <div className="w-full min-h-0 flex flex-1 flex-col items-start gap-7 overflow-y-auto dropdown-scroll scrollbar-none">
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
              <div className="flex justify-start items-center flex-wrap gap-2">
                {editedTicket.breadcrumbs.map(getBreadcrumb)}
              </div>
              {/* // TODO: вернуть выбор действия после ответа бэка (вопрос №34). */}
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
          <CancelFormButton onClick={handleCloseAttempt} />

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
              disabled={isFormInvalid || isSubmitting}
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
              disabled={isFormInvalid || isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TicketEditPage() {
  const params = useParams<{ ticketId: string }>();
  const ticketId = Number(params.ticketId);

  const {
    tickets,
    favoriteTickets,
    setFavoriteTickets,
    handleEditSubmit,
    isLoading,
    error,
    reload,
  } = useOutletContext<OutletContextProps>();

  const { ticket, action } = useTicketAndAction({
    ticketId,
    tickets,
    allActions,
  });

  const pageState = getTicketPageState({ isLoading, error, ticket, action });
  if (pageState) {
    return <ListStateMessage variant={pageState} onRetry={reload} />;
  }
  if (!ticket || !action) return null;

  return (
    <TicketEditForm
      key={ticket.ticketId}
      ticket={ticket}
      action={action}
      favoriteTickets={favoriteTickets}
      setFavoriteTickets={setFavoriteTickets}
      handleEditSubmit={handleEditSubmit}
    />
  );
}

export default TicketEditPage;
