import type React from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";

import useTicketAndAction from "../../../hooks/useTicketAndAction";
import useUser from "../../../hooks/useUser";

import type { StatusType, Ticket } from "../../../types/ticket.types";
import type { ModalTypes } from "../../../types/modalTypes";

import { getTicketPermissions } from "../../../utils/ticketPermissions";
import getBreadcrumb from "../../../utils/getBreadcrumbs";
import { allActions } from "../../../utils/allActions";

import TicketHeaderInfo from "../modalCardWindows/TicketHeaderInfo";
import FunctionBtn from "../../ui/Buttons/FunctionBtn";
import TicketAttachmentsView from "../../ui/Attachment/TicketAttachmentsView";

import { shadowLiftButtonStyle } from "../../../styles/shadowLift";
import TelegramIcon from "../../../icons/card/TelegramIcon";
import RepeatIcon from "../../../icons/card/RepeatIcon";
import EditIcon from "../../../icons/card/EditIcon";
import CancelIcon from "../../../icons/card/CancelIcon";
import TicketInfoIcon from "../../../icons/card/TicketInfoIcon";
import AttachmentIcon from "../../../icons/createTicket/AttachmentIcon";
import MobileArrowIcon from "../../../icons/mobile/MobileArrowIcon";
import useMediaQuery from "../../../hooks/useMediaQuery";
import useEscButton from "../../../hooks/useEscButton";

interface TicketViewPageProps {
  tickets: Ticket[];
  favoriteTickets: number[];
  setFavoriteTickets: (id: number[]) => void;

  handleStatusChange: (ticketId: number, status: StatusType) => void;
  setActiveModal: React.Dispatch<React.SetStateAction<ModalTypes>>;
}

function TicketViewPage() {
  useEscButton(() => navigate(-1));

  const params = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const ticketId = Number(params.ticketId);

  const {
    tickets,
    favoriteTickets,
    setFavoriteTickets,
    handleStatusChange,
    setActiveModal,
  } = useOutletContext<TicketViewPageProps>();

  const currentUser = useUser();
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const { ticket: viewedTicket, action: viewedAction } = useTicketAndAction({
    ticketId,
    tickets,
    allActions,
  });

  if (!currentUser || !viewedTicket || !viewedAction) return;

  const permissions = getTicketPermissions(viewedTicket, currentUser);

  const iconClassName = "w-5 h-5 shrink-0 text-(--text-primary)!";
  const textClassName =
    "font-consolas font-medium text-xs text-(--text-primary) leading-3.5 group-enabled:group-hover:text-(--bg-btn-primary)";

  //TODO: Make only icons for sm screen
  const btnClassName = `w-full h-full flex justify-center items-center px-4 py-2 border border-(--bg-border)
  disabled:bg-(--bg-disable-btn)
  enabled:bg-(--bg-primary-second) group
  ${shadowLiftButtonStyle}`;
  const innerDivClassName = "flex flex-col justify-center items-center gap-1";

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="max-w-200 mx-auto w-full h-full flex flex-col items-center rounded-xs py-10 px-1.5 p-auto select-none"
    >
      {/* Functional btns */}
      <div
        className={`max-w-200 mx-auto
         ${isDesktop ? "sticky " : "fixed top-15.5"}
        
      w-full h-15 z-30
      flex justify-center select-none`}
      >
        <FunctionBtn
          Icon={CancelIcon}
          iconClassName={iconClassName}
          text="Отменить"
          textClassName={textClassName}
          btnClassName={btnClassName}
          innerDivClassName={innerDivClassName}
          onClick={() => {
            if (viewedTicket) {
              setActiveModal({
                type: "cancel",
                ticketId: viewedTicket.ticketId,
                from: "view",
              });
            }
          }}
          disabled={!permissions.canCancel}
        />
        <FunctionBtn
          Icon={EditIcon}
          iconClassName={iconClassName}
          text="Изменить"
          textClassName={textClassName}
          btnClassName={btnClassName}
          innerDivClassName={innerDivClassName}
          onClick={() => {
            navigate(`/tickets/${viewedTicket.ticketId}/edit`);
          }}
          disabled={!permissions.canEdit}
        />

        <FunctionBtn
          Icon={RepeatIcon}
          iconClassName={iconClassName}
          text="Повторить"
          textClassName={textClassName}
          btnClassName={btnClassName}
          innerDivClassName={innerDivClassName}
          onClick={() => {
            navigate(`/tickets/${viewedTicket.ticketId}/repeat`);
          }}
          disabled={false}
        />
        <FunctionBtn
          Icon={TelegramIcon}
          iconClassName={iconClassName}
          text="Сообщение"
          textClassName={textClassName}
          btnClassName={btnClassName}
          innerDivClassName={innerDivClassName}
          onClick={() => console.log("TODO: send message to telegram")}
          disabled={false}
        />
      </div>

      {/*  border */}
      <div
        className={`w-full h-full
      flex flex-col justify-center items-center
      border border-(--bg-border)
      bg-(--bg-secondary)
      ${isDesktop ? "" : "mt-22 mb-12"}
      px-5 py-6 
      gap-5
      `}
      >
        {/* Back step btn */}
        <div className="w-full flex justify-start items-center select-none">
          <button
            className="cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          >
            <MobileArrowIcon className="text-(--text-primary)" />
          </button>
        </div>

        {/* Ticket header and content */}
        <div className="w-full h-full gap-7 flex flex-col items-start overflow-y-auto dropdown-scroll">
          <TicketHeaderInfo
            favoriteTickets={favoriteTickets}
            setFavoriteTickets={setFavoriteTickets}
            ticket={viewedTicket}
            onStatusChange={
              permissions.canChangeStatus
                ? (newStatus) =>
                    handleStatusChange(viewedTicket.ticketId, newStatus)
                : undefined
            }
            className="xl:px-0!"
          />
          {/* Divider */}
          <div className="w-full h-px bg-(--bg-disable-btn) my-3"></div>
          {/* Content */}
          <div className="w-full h-full flex flex-col items-start gap-7">
            {/* Section container */}
            <div className="w-full flex items-start gap-1">
              <TicketInfoIcon className="text-(--text-primary)" />
              <span className="font-jbmono font-normal text-sm text-(--text-primary) leading-5">
                Информация о заявке
              </span>
            </div>
            <div className="w-full flex flex-col items-start justify-center gap-6 xl:gap-8">
              {/* TODO: make wrap for crumbs if they don't fit  */}
              <div className="w-full flex flex-col items-start gap-4 xl:gap-2">
                <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-3">
                  Категории
                </span>
                <div className="flex justify-start items-center gap-2">
                  {viewedTicket.breadcrumbs.map(getBreadcrumb)}
                </div>
              </div>
              {viewedAction.fields.map((field) => {
                const value =
                  field.type === "multi text" || field.type === "multiselect"
                    ? (viewedTicket.multiBody[field.name] ?? []).join(", ")
                    : (viewedTicket.body[field.name] ?? "");

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
            {viewedTicket.attachedFiles.length > 0 && (
              <div className="w-full flex flex-col items-start gap-7">
                {/* Label */}
                <div className="w-full flex items-center gap-1">
                  <AttachmentIcon className="text-(--text-primary)" />
                  <span className="font-jbmono font-normal text-sm text-(--text-primary) leading-5">
                    Прикрепленные файлы
                  </span>
                </div>

                <div className="w-full">
                  {/* иконка + подпись "Прикреплённые файлы" */}
                  <TicketAttachmentsView files={viewedTicket.attachedFiles} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketViewPage;
