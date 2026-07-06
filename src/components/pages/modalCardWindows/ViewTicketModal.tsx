import { createPortal } from "react-dom";

import useLockBodyScroll from "../../../hooks/useLockBodyScroll";
import useEscapeKey from "../../../hooks/useEscapeKey";

import type { Ticket } from "../../../types/ticket.types";
import type { Action } from "../../../types/createTicket.type";

import getStatusTitle from "../../../utils/ticketBadgeHelpers";
import { getStatusColor } from "../../../utils/ticketBadgeHelpers";
import { getPriorityTitle } from "../../../utils/ticketBadgeHelpers";

import FunctionBtn from "../../ui/Buttons/FunctionBtn";

import TelegramIcon from "../../../icons/card/TelegramIcon";
import RepeatIcon from "../../../icons/card/RepeatIcon";
import EditIcon from "../../../icons/card/EditIcon";
import CancelIcon from "../../../icons/card/CancelIcon";
import CrossTicketIcon from "../../../icons/createTicket/CrossTicketIcon";
import FavoriteTicketIcon from "../../../icons/card/FavoriteTicketIcon";
import TicketInfoIcon from "../../../icons/card/TicketInfoIcon";
import AttachmentIcon from "../../../icons/createTicket/AttachmentIcon";
import TicketAttachmentsView from "../../ui/Attachment/TicketAttachmentsView";

interface ViewTicketModalProps {
  ticket: Ticket | undefined;
  action: Action;
  onClose: () => void;

  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;
}

function ViewTicketModal({
  ticket,
  // action,
  onClose,
  favoriteTickets,
  setFavoriteTickets,
}: ViewTicketModalProps) {
  useLockBodyScroll();
  useEscapeKey(onClose);

  if (!ticket) return null;

  const isBtnDisabled = ticket.status !== "New";

  const iconClassName = "w-4.5 h-4.5 text-(--text-primary)!";
  const textClassName =
    "font-jbmono font-medium text-xs text-(--text-primary) leading-normal";
  // const outerDivClassName = `w-fit h-8.5 rounded-xs select-none bg-(--text-primary) `;
  //TODO: take this logic of box shadow and implement in other places

  const outerDivClassName = `w-fit h-8.5`;
  const outerBtnClassName = `w-full h-full flex justify-center items-center px-4 py-2 rounded-xs enabled:bg-(--bg-inactive-btn) disabled:bg-(--bg-disable-btn) enabled:cursor-pointer transition-all duration-600 ease-in-out enabled:hover:-translate-x-1 enabled:hover:-translate-y-1 enabled:hover:z-10 enabled:hover:shadow-[4px_4px_0_0_var(--text-primary)]`;

  // const outerBtnClassName = `h-full flex justify-center items-center px-4 py-2 rounded-xs enabled:bg-(--bg-inactive-btn) disabled:bg-(--bg-disable-btn) enabled:cursor-pointer enabled:hover:-translate-x-1 enabled:hover:-translate-y-1 enabled:hover:z-10 transition-all duration-600 ease-in-out`;
  const innerDivClassName = "flex items-center gap-1";

  function getBreadcrumb(crumb: string) {
    return (
      <div
        key={crumb}
        className="flex justify-center items-center px-3 py-1.5
      border-[0.5px] border=(--text-secondary) bg-(--bg-secondary) rounded-xs"
      >
        <span className="font-jbmono font-medium text-xs text-(--text-primary) leading-3">
          {crumb}
        </span>
      </div>
    );
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
        className="w-[90vw] h-[90vh] flex flex-col items-center
      bg-(--bg-secondary) border border-(--bg-border) rounded-xs px-12.5 py-10"
      >
        {/* Header with btns */}
        <div
          className="w-full h-8.5
    flex justify-between items-center"
        >
          {/* Functional btns */}
          <div className="w-full flex justify-start gap-1.5">
            <FunctionBtn
              Icon={TelegramIcon}
              iconClassName={iconClassName}
              text="Отправить сообщение"
              textClassName={textClassName}
              outerDivClassName={outerDivClassName}
              outerBtnClassName={outerBtnClassName}
              innerDivClassName={innerDivClassName}
              onClick={() => console.log("TODO: send message to telegram")}
              disabled={false}
            />
            <FunctionBtn
              Icon={RepeatIcon}
              iconClassName={iconClassName}
              text="Повторить"
              textClassName={textClassName}
              outerDivClassName={outerDivClassName}
              outerBtnClassName={outerBtnClassName}
              innerDivClassName={innerDivClassName}
              onClick={() => console.log("TODO: repeat ticket")}
              disabled={false}
            />
            <FunctionBtn
              Icon={EditIcon}
              iconClassName={iconClassName}
              text="Изменить"
              textClassName={textClassName}
              outerDivClassName={outerDivClassName}
              outerBtnClassName={outerBtnClassName}
              innerDivClassName={innerDivClassName}
              onClick={() => console.log("TODO: edit ticket")}
              disabled={isBtnDisabled}
            />
            <FunctionBtn
              Icon={CancelIcon}
              iconClassName={iconClassName}
              text="Отменить"
              textClassName={textClassName}
              outerDivClassName={outerDivClassName}
              outerBtnClassName={outerBtnClassName}
              innerDivClassName={innerDivClassName}
              onClick={() => console.log("TODO: cancel ticket")}
              disabled={isBtnDisabled}
            />
          </div>

          {/* Close btn */}
          <button
            className={`flex justify-center items-center gap-1 cursor-pointer group transition-all duration-300 ease-in-out active:opacity-0 select-none`}
            onClick={onClose}
          >
            <CrossTicketIcon
              className={`text-(--text-secondary) group-hover:text-(--text-primary) transition-colors duration-300`}
            />
            <span
              className={`font-jbmono text-xs text-(--text-secondary) font-medium leading-normal group-hover:text-(--text-primary) transition-colors duration-300`}
            >
              Закрыть
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-(--bg-disable-btn) my-3"></div>

        {/* Ticket header and content */}
        <div
          className="w-full gap-7
        flex flex-col items-start overflow-y-auto dropdown-scroll"
        >
          {/* Header */}
          <div className="w-full flex flex-col items-start gap-1">
            {/* Title ticket */}
            <div className="w-full flex justify-start items-center gap-2">
              {/* Icon */}
              <button className="cursor-pointer">
                <FavoriteTicketIcon
                  ticketId={ticket.ticketId}
                  favoriteTickets={favoriteTickets}
                  setFavoriteTickets={setFavoriteTickets}
                />
              </button>
              {/* Title, status, priority */}
              <div className=" w-full flex justify-start items-center gap-3 py-3">
                <span className="font-jbmono font-medium text-[15px] text-(--text-primary) leading-6">
                  {ticket.title}
                </span>
                <div className={`${getStatusColor(ticket.status)} text-xs`}>
                  {getStatusTitle(ticket.status, "singular")}
                </div>
                <div
                  className="h-5 flex justify-center items-center px-2 py-1.5 gap-2.5
            bg-(--text-primary) text-(--bg-primary) text-xs
            dark:bg-transparent dark:border dark:border-(--text-tertiary) dark:text-(--text-tertiary)
            rounded-xs font-bold leading-3 select-none"
                >
                  {getPriorityTitle(ticket.priority)}
                </div>
              </div>
            </div>
            {/* Ticket meta info */}
            <div
              className="w-full flex justify-start items-center
            font-consolas font-normal text-[11px] text-(--text-secondary) leading-4"
            >
              {`ID: ${ticket.ticketId} | Дата создания: ${ticket.createDate} | Автор: ${ticket.userName}`}
            </div>
          </div>

          {/* Content */}
          <div className="w-full flex flex-col items-start gap-7">
            {/* Section container */}
            <div className="w-full flex items-start gap-1">
              <TicketInfoIcon className="text-(text-primary)" />
              <span className="font-jbmono font-normal text-sm text-(--text-primary) leading-5">
                Информация о заявке
              </span>
            </div>
            <div className="w-full flex flex-col items-start justify-center gap-8">
              <div className="w-full flex flex-col items-start gap-4">
                <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-3">
                  Категории
                </span>
                {/* Bread crumbs */}
                <div className="flex justify-start items-center gap-2">
                  {ticket.breadcrumbs.map(getBreadcrumb)}
                </div>
              </div>
              <div>//TODO: decide how to get info like "Prgramm/service"</div>
              <div>
                <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-3">
                  Описание проблемы
                </span>
                <span>
                  {/* //TODO: decide how to get desctiption from the ticket */}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-(--bg-disable-btn) my-3"></div>

            {/* Attachment */}
            {ticket.attachedFiles.length > 0 && (
              <div className="w-full flex flex-col items-start gap-7">
                {/* Label */}
                <div className="w-full flex items-center gap-1">
                  <AttachmentIcon />
                  <span className="font-jbmono font-normal text-sm text-(--text-primary) leading-5">
                    Прикрепленные файлы
                  </span>
                </div>

                <div>
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
