import { useNavigate, useOutletContext } from "react-router";
import type { TicketStatusType } from "../../../types/createTicket.type";
import { useEffect } from "react";
import SuccessCreateIcon from "../../../icons/createTicket/SuccessCreateIcon";
import FailCreateIcon from "../../../icons/createTicket/FailCreateIcon";

interface OutletContextProps {
  ticketId: number;
  ticketStatus: TicketStatusType;
  hasSubmitted: boolean;
}

function MobileStepDone() {
  const navigate = useNavigate();

  const { ticketId, ticketStatus, hasSubmitted } =
    useOutletContext<OutletContextProps>();

  //TODO: Uncomment this UseEffect & Make error on 3rd step by modal or popup window
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     navigate("/");
  //   }, 3000);
  //   return () => clearTimeout(timeout);
  // }, [navigate]);

  useEffect(() => {
    if (!hasSubmitted) {
      navigate("../category", { replace: true });
    }
  }, [hasSubmitted, navigate]);

  if (!hasSubmitted) return null;

  return (
    <div className="w-full h-full flex justify-center items-center select-none">
      <div className="max-w-full w-auto max-h-full h-54.5 py-2 px-10 flex flex-col justify-center items-center gap-6 bg-(--bg-secondary) border border-(--bg-border)">
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

export default MobileStepDone;
