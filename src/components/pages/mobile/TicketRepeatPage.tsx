import { useNavigate, useOutletContext, useParams } from "react-router";
import useUser from "../../../hooks/useUser";
import useMediaQuery from "../../../hooks/useMediaQuery";
import useTicketAndAction from "../../../hooks/useTicketAndAction";
import useEditRepeatForm from "../../../hooks/useEditRepeatForm";

import type { PriorityLevel, Action } from "../../../types/createTicket.type";
import type { Ticket, TicketAttachmentType } from "../../../types/ticket.types";

import { allActions } from "../../../utils/allActions";
import getBreadcrumb from "../../../utils/getBreadcrumbs";

import ConfirmModal from "../modalCardWindows/ConfirmModal";
import TicketForm from "../../TicketForm";
import AttachmentField from "../../ui/Attachment/AttachmentField";
import FunctionBtn from "../../ui/Buttons/FunctionBtn";

import { shadowLiftButtonStyle } from "../../../styles/shadowLift";

import RepeatIcon from "../../../icons/card/RepeatIcon";
import TicketInfoIcon from "../../../icons/card/TicketInfoIcon";
import SendFormIcon from "../../../icons/createTicket/SendFormIcon";
import useEscButton from "../../../hooks/useEscButton";
import CancelFormButton from "../../ui/Buttons/CancelFormButton";

interface OutletContextProps {
  tickets: Ticket[];
  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
  handleRepeatSubmit(
    data: {
      formData: Record<string, string>;
      multiData: Record<string, string[]>;
      priority: PriorityLevel;
      attachedFiles: TicketAttachmentType;
    },
    repeatTicket: Ticket | undefined,
    repeatAction: Action | undefined,
  ): void;
}

function TicketRepeatPage() {
  const currentUser = useUser();
  const navigate = useNavigate();
  // const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 500px)");

  const params = useParams<{ ticketId: string }>();
  const ticketId = Number(params.ticketId);

  const { tickets, handleRepeatSubmit } =
    useOutletContext<OutletContextProps>();

  const { ticket: repeatedTicket, action: repeatedAction } = useTicketAndAction(
    {
      ticketId,
      tickets,
      allActions,
    },
  );

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
    files,
    setFiles,
    isDragging,
    setIsDragging,
    isConfirmCloseOpen,
    setIsConfirmCloseOpen,
    handleCloseAttempt,
    handleSubmit,
    addFiles,
    clearError,
    setFieldError,
    currentAction,
    isFormInvalid,
  } = useEditRepeatForm({
    ticket: repeatedTicket,
    action: repeatedAction,
    mode: "repeat",
    onClose,
    onSubmit: (data) => {
      handleRepeatSubmit(data, repeatedTicket, repeatedAction);
      navigate("/");
    },
  });

  useEscButton(handleCloseAttempt);

  if (!currentUser || !repeatedTicket || !repeatedAction) return null;

  const inputText =
    "Вы уверены, что хотите прервать создание заявки?\n\nВведенная информация не сохранится.";

  return (
    <div className="h-full flex flex-col px-1.5">
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
        className={`w-full h-full min-h-0 max-w-200 mx-auto py-6 px-5
        flex flex-col items-center gap-4
        bg-(--bg-secondary) border border-(--bg-border)
        select-none overflow-y-auto
        mt-2 mb-2
    `}
      >
        <div className="w-full min-h-0 flex flex-col justify-center items-start gap-3 ">
          <div className="w-full flex items-center gap-1">
            <RepeatIcon className="text(--text-secondary) w-4 h-4" />
            <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-4">{`Повтор заявки #${repeatedTicket.ticketId}`}</span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-(--bg-disable-btn)"></div>
        </div>

        {/* Content */}
        <div className="w-full flex flex-col items-start gap-7 overflow-y-auto dropdown-scroll scrollbar-none">
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

              <div
                className={`flex justify-start items-center flex-wrap gap-2`}
              >
                {repeatedTicket.breadcrumbs.map(getBreadcrumb)}
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

          {/* Divider */}
          <div className="w-full h-px bg-(--bg-disable-btn)"></div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-1 justify-between items-end ">
          {/* Back btn */}
          <CancelFormButton onClick={handleCloseAttempt} />

          {/* Send ticket btn */}
          {isMobile ? (
            <FunctionBtn
              Icon={SendFormIcon}
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
              Icon={SendFormIcon}
              iconClassName="w-4.5 h-4.5 text-(--text-btn)"
              text={"Отправить заявку"}
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

export default TicketRepeatPage;
