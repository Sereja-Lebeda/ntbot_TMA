import { createPortal } from "react-dom";

import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import useModalStackEntry from "../../../hooks/useModalStackEntry";
import useUser from "../../../hooks/useUser";

import type { StatusType, Ticket } from "../../../types/ticket.types";
import type { Action } from "../../../types/createTicket.type";

import TicketHeaderInfo from "./TicketHeaderInfo";
import FunctionBtn from "../../ui/Buttons/FunctionBtn";
import TicketAttachmentsView from "../../ui/Attachment/TicketAttachmentsView";

import { getTicketPermissions } from "../../../utils/ticketPermissions";
import getBreadcrumb from "../../../utils/getBreadcrumbs";
import { shadowLiftButtonStyle } from "../../../styles/shadowLift";

import TelegramIcon from "../../../icons/card/TelegramIcon";
import RepeatIcon from "../../../icons/card/RepeatIcon";
import EditIcon from "../../../icons/card/EditIcon";
import CancelIcon from "../../../icons/card/CancelIcon";
import CrossTicketIcon from "../../../icons/createTicket/CrossTicketIcon";
import TicketInfoIcon from "../../../icons/card/TicketInfoIcon";
import AttachmentIcon from "../../../icons/createTicket/AttachmentIcon";

interface ViewTicketModalProps {
  ticket: Ticket | undefined;
  action: Action | undefined;
  onClose: () => void;
  onRepeat: () => void;
  onCancel: (ticketId: number) => void;
  onEdit: () => void;
  onChangeStatus: (ticketId: number, newStatus: StatusType) => void;

  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
}

function ViewTicketModal({
  ticket,
  action,
  onClose,
  onRepeat,
  onCancel,
  onEdit,
  onChangeStatus,
  favoriteTickets,
  setFavoriteTickets,
}: ViewTicketModalProps) {
  useLockBodyScroll();
  useModalStackEntry(onClose);

  const currentUser = useUser();
  if (!currentUser || !ticket || !action) return null;
  const permissions = getTicketPermissions(ticket, currentUser);

  const iconClassName =
    "xl:w-4.5 xl:h-4.5 xl:shrink-0 xl:text-(--text-primary)!";
  const textClassName =
    "xl:font-jbmono xl:font-medium xl:text-xs xl:text-(--text-primary) xl:leading-normal";

  //TODO: Make only icons for sm screen
  const btnClassName = `xl:w-fit xl:h-8.5 xl:flex xl:justify-center xl:items-center xl:px-4 xl:py-2 xl:rounded-xs
  xl:enabled:bg-(--bg-inactive-btn)
  ${shadowLiftButtonStyle}`;

  const innerDivClassName = "xl:flex xl:items-center xl:gap-1";

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full h-full xl:w-[50vw] xl:max-w-[90vw] xl:max-h-[90vh] xl:flex xl:flex-col xl:items-center bg-(--bg-secondary) xl:border xl:border-(--bg-border) xl:rounded-xs xl:py-10 xl:select-none"
      >
        {/* Header with btns */}
        <div className="xl:w-full xl:h-8.5 xl:mb-2 xl:px-12.5 xl:flex xl:justify-between xl:items-center">
          {/* //TODO: Make only icons if window is narrow */}
          {/* Functional btns */}
          <div className="xl:w-full xl:flex xl:justify-start xl:gap-1.5 xl:select-none">
            <FunctionBtn
              Icon={TelegramIcon}
              iconClassName={iconClassName}
              text="Отправить сообщение"
              textClassName={textClassName}
              btnClassName={btnClassName}
              innerDivClassName={innerDivClassName}
              onClick={() => console.log("TODO: send message to telegram")}
              disabled={false}
            />
            <FunctionBtn
              Icon={RepeatIcon}
              iconClassName={iconClassName}
              text="Повторить"
              textClassName={textClassName}
              btnClassName={btnClassName}
              innerDivClassName={innerDivClassName}
              onClick={onRepeat}
              disabled={false}
            />
            <FunctionBtn
              Icon={EditIcon}
              iconClassName={iconClassName}
              text="Изменить"
              textClassName={textClassName}
              btnClassName={btnClassName}
              innerDivClassName={innerDivClassName}
              onClick={onEdit}
              disabled={!permissions.canEdit}
            />
            <FunctionBtn
              Icon={CancelIcon}
              iconClassName={iconClassName}
              text="Отменить"
              textClassName={textClassName}
              btnClassName={btnClassName}
              innerDivClassName={innerDivClassName}
              onClick={() => onCancel(ticket.ticketId)}
              disabled={!permissions.canCancel}
            />
          </div>

          {/* Close btn */}
          <button
            className="xl:flex xl:justify-center xl:items-center xl:gap-1 xl:cursor-pointer xl:group xl:transition-all xl:duration-300 xl:ease-in-out xl:active:opacity-0 xl:select-none"
            onClick={onClose}
          >
            <CrossTicketIcon className="xl:text-(--text-secondary) xl:group-hover:text-(--text-primary) xl:transition-colors xl:duration-300" />
            <span className="font-jbmono text-xs text-(--text-secondary) font-medium leading-normal group-hover:text-(--text-primary) transition-colors duration-300">
              Закрыть
            </span>
          </button>
        </div>
        {/* Divider */}
        <div className="xl:w-full xl:h-px xl:bg-(--bg-disable-btn) xl:my-3"></div>
        {/* Ticket header and content */}
        <div className="xl:w-full xl:gap-7 xl:px-12.5 xl:flex xl:flex-col xl:items-start xl:overflow-y-auto dropdown-scroll">
          <TicketHeaderInfo
            favoriteTickets={favoriteTickets}
            setFavoriteTickets={setFavoriteTickets}
            ticket={ticket}
            onStatusChange={
              permissions.canChangeStatus
                ? (newStatus) => onChangeStatus(ticket.ticketId, newStatus)
                : undefined
            }
            className="xl:px-0!"
          />
          {/* Content */}
          <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:gap-7">
            {/* Section container */}
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
                <div className="xl:flex xl:justify-start xl:items-center xl:gap-2">
                  {ticket.breadcrumbs.map(getBreadcrumb)}
                </div>
              </div>
              {action.fields.map((field) => {
                const value =
                  field.type === "multi text" || field.type === "multiselect"
                    ? (ticket.multiBody[field.name] ?? []).join(", ")
                    : (ticket.body[field.name] ?? "");

                return (
                  <div
                    key={field.name}
                    className="xl:w-full xl:flex xl:flex-col xl:items-start xl:gap-2"
                  >
                    <span className="xl:font-consolas xl:font-normal xl:text-xs xl:text-(--text-secondary) xl:leading-3">
                      {field.label}
                    </span>
                    <span className="xl:font-consolas xl:font-normal xl:text-sm xl:text-(--text-primary)">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="xl:w-full xl:h-px xl:bg-(--bg-disable-btn) xl:my-3"></div>

            {/* Attachment */}
            {ticket.attachedFiles.length > 0 && (
              <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:gap-7">
                {/* Label */}
                <div className="xl:w-full xl:flex xl:items-center xl:gap-1">
                  <AttachmentIcon />
                  <span className="xl:font-jbmono xl:font-normal xl:text-sm xl:text-(--text-primary) xl:leading-5">
                    Прикрепленные файлы
                  </span>
                </div>

                <div className="xl:w-full">
                  {/* иконка + подпись "Прикреплённые файлы" */}
                  <TicketAttachmentsView files={ticket.attachedFiles} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ViewTicketModal;
