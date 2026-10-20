import { useNavigate } from "react-router";
import { useEffect } from "react";

import SuccessCreateIcon from "../../../icons/createTicket/SuccessCreateIcon";

interface StepDoneProps {
  ticketId: number | null;
}

function StepDone({ ticketId }: StepDoneProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="w-full h-full mt-39 flex justify-center items-center select-none">
      <div className="max-w-full w-113 max-h-full h-54.5 py-2 px-4 flex flex-col justify-center items-center gap-6 bg-(--bg-secondary) border border-(--bg-border)">
        <SuccessCreateIcon className="text-(--text-primary)" />
        <span className="font-jbmono font-bold text-(--text-primary) text-2xl leading-7.5 text-center">
          Заявка
          {ticketId !== null && (
            <span className="text-(--bg-btn-primary)">{` #${ticketId}`}</span>
          )}{" "}
          создана
        </span>
      </div>
    </div>
  );
}

export default StepDone;
