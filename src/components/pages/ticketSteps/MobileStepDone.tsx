import { useNavigate, useOutletContext } from "react-router";

import { useEffect } from "react";
import SuccessCreateIcon from "../../../icons/createTicket/SuccessCreateIcon";

interface OutletContextProps {
  ticketId: number | null;
  hasSubmitted: boolean;
}

function MobileStepDone() {
  const navigate = useNavigate();

  const { ticketId, hasSubmitted } = useOutletContext<OutletContextProps>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  useEffect(() => {
    if (!hasSubmitted) {
      navigate("../category", { replace: true });
    }
  }, [hasSubmitted, navigate]);

  if (!hasSubmitted) return null;

  return (
    <div className="w-full h-full flex justify-center items-center select-none">
      <div className="max-w-full w-auto max-h-full h-54.5 py-2 px-10 flex flex-col justify-center items-center gap-6 bg-(--bg-secondary) border border-(--bg-border)">
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

export default MobileStepDone;
