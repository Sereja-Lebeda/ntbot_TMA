interface StepDoneProps {
  ticketId: number;
  ticketStatus: TicketStatusType;
}

import { useNavigate } from "react-router";
import { useEffect } from "react";

import type { TicketStatusType } from "../../../types/createTicket.type";

import FailCreateIcon from "../../../icons/createTicket/FailCreateIcon";
import SuccessCreateIcon from "../../../icons/createTicket/SuccessCreateIcon";

//NOTE: redirect only when success
function StepDone({ ticketId, ticketStatus }: StepDoneProps) {
  const navigate = useNavigate();

  //TODO: Make error on 3rd step by modal or popup window
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div
      className="w-full h-full mt-39
    flex justify-center items-center select-none"
    >
      <div
        className="max-w-full w-113 max-h-full h-54.5 py-2 px-4
      flex flex-col justify-center items-center gap-6
      bg-(--bg-secondary)
      border border-(--bg-border)"
      >
        {ticketStatus === "Success" ? (
          <>
            <SuccessCreateIcon className="text-(--text-primary)" />
            <span className="font-jbmono font-bold text-(--text-primary) text-2xl leading-7.5 text-center">
              Заявка{" "}
              <span className="text-(--bg-btn-primary)">{`#${ticketId}`}</span>{" "}
              создана
            </span>
          </>
        ) : (
          <>
            <FailCreateIcon className="w-12 h-12 text-(--text-primary)" />
            <span className="font-jbmono font-bold text-(--text-primary) text-2xl leading-7.5 text-center">
              <span className="text-(--bg-task-error)">Ошибка:</span> Заявка не
              создана
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default StepDone;
