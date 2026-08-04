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
      className="xl:w-full xl:h-full xl:mt-39 xl:flex xl:justify-center xl:items-center xl:select-none"
    >
      <div
        className="xl:max-w-full xl:w-113 xl:max-h-full xl:h-54.5 xl:py-2 xl:px-4 xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-6 xl:bg-(--bg-secondary) xl:border xl:border-(--bg-border)"
      >
        {ticketStatus === "Success" ? (
          <>
            <SuccessCreateIcon className="xl:text-(--text-primary)" />
            <span className="xl:font-jbmono xl:font-bold xl:text-(--text-primary) xl:text-2xl xl:leading-7.5 xl:text-center">
              Заявка{" "}
              <span className="xl:text-(--bg-btn-primary)">{`#${ticketId}`}</span>{" "}
              создана
            </span>
          </>
        ) : (
          <>
            <FailCreateIcon className="xl:w-12 xl:h-12 xl:text-(--text-primary)" />
            <span className="xl:font-jbmono xl:font-bold xl:text-(--text-primary) xl:text-2xl xl:leading-7.5 xl:text-center">
              <span className="xl:text-(--bg-task-error)">Ошибка:</span> Заявка не
              создана
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default StepDone;
