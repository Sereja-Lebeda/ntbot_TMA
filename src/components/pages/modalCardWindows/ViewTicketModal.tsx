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
import useMediaQuery from "../../../hooks/useMediaQuery";

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
  const isDesktop = useMediaQuery("(min-width:1280px)");
  if (!currentUser || !ticket || !action) return null;
  const permissions = getTicketPermissions(ticket, currentUser);

  const iconClassName = "w-4.5 h-4.5 shrink-0 text-(--text-primary)!";
  const textClassName =
    "font-jbmono font-medium text-xs text-(--text-primary) leading-normal";

  const btnClassName = `w-fit h-8.5 flex justify-center items-center px-4 py-2 rounded-xs
  enabled:bg-(--bg-inactive-btn)
  ${shadowLiftButtonStyle}`;

  const innerDivClassName = "flex items-center xl:gap-1";

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[] min-w-[50vw] max-w-[90vw] max-h-[90vh] flex flex-col items-center bg-(--bg-secondary) border border-(--bg-border) rounded-xs py-10 select-none"
      >
        {/* Header with btns */}
        <div className="w-full h-8.5 mb-2 px-12.5 flex justify-between items-center gap-4">
          {/* //TODO: Make only icons if window is narrow */}
          {/* Functional btns */}
          <div className="w-full flex justify-start gap-1.5 select-none">
            <FunctionBtn
              Icon={TelegramIcon}
              iconClassName={iconClassName}
              text={isDesktop ? "Отправить сообщение" : ""}
              textClassName={textClassName}
              btnClassName={btnClassName}
              innerDivClassName={innerDivClassName}
              onClick={() => console.log("TODO: send message to telegram")}
              disabled={false}
            />
            <FunctionBtn
              Icon={RepeatIcon}
              iconClassName={iconClassName}
              text={isDesktop ? "Повторить" : ""}
              textClassName={textClassName}
              btnClassName={btnClassName}
              innerDivClassName={innerDivClassName}
              onClick={onRepeat}
              disabled={false}
            />
            <FunctionBtn
              Icon={EditIcon}
              iconClassName={iconClassName}
              text={isDesktop ? "Изменить" : ""}
              textClassName={textClassName}
              btnClassName={btnClassName}
              innerDivClassName={innerDivClassName}
              onClick={onEdit}
              disabled={!permissions.canEdit}
            />
            <FunctionBtn
              Icon={CancelIcon}
              iconClassName={iconClassName}
              text={isDesktop ? "Отменить" : ""}
              textClassName={textClassName}
              btnClassName={btnClassName}
              innerDivClassName={innerDivClassName}
              onClick={() => onCancel(ticket.ticketId)}
              disabled={!permissions.canCancel}
            />
          </div>

          {/* Close btn */}
          <button
            className="flex justify-center items-center gap-1 cursor-pointer group transition-all duration-300 ease-in-out active:opacity-0 select-none group"
            onClick={onClose}
          >
            <CrossTicketIcon
              className={`text-(--text-secondary) group-hover:text-(--text-primary) transition-colors duration-300
              ${isDesktop ? "" : "w-4 h-4"}
              `}
            />
            {isDesktop && (
              <span className="font-jbmono text-xs text-(--text-secondary) font-medium leading-normal group-hover:text-(--text-primary) transition-colors duration-300">
                Закрыть
              </span>
            )}
          </button>
        </div>
        {/* Divider */}
        <div className="w-full h-px bg-(--bg-disable-btn) my-3"></div>
        {/* Ticket header and content */}
        <div className="w-full gap-7 px-12.5 flex flex-col items-start overflow-y-auto dropdown-scroll">
          <TicketHeaderInfo
            favoriteTickets={favoriteTickets}
            setFavoriteTickets={setFavoriteTickets}
            ticket={ticket}
            onStatusChange={
              permissions.canChangeStatus
                ? (newStatus) => onChangeStatus(ticket.ticketId, newStatus)
                : undefined
            }
            className="px-0!"
          />
          {/* Content */}
          <div className="w-full flex flex-col items-start gap-7">
            {/* Section container */}
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
                <div className="flex justify-start items-center gap-2">
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
                    className="w-full flex flex-col items-start gap-2"
                  >
                    <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-3">
                      {field.label}
                    </span>
                    <span className="font-consolas font-normal text-sm text-(--text-primary)">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-(--bg-disable-btn) my-3"></div>

            {/* Attachment */}
            {ticket.attachedFiles.length > 0 && (
              <div className="w-full flex flex-col items-start gap-7">
                {/* Label */}
                <div className="w-full flex items-center gap-1">
                  <AttachmentIcon className="shrink-0 text-(--text-primary)" />
                  <span className="font-jbmono font-normal text-sm text-(--text-primary) leading-5">
                    Прикрепленные файлы
                  </span>
                </div>

                <div className="w-full">
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
