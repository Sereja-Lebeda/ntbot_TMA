import { Outlet, useOutletContext } from "react-router";
import { useState } from "react";
import useModalStackEntry from "../../hooks/useModalStackEntry";
import useMediaQuery from "../../hooks/useMediaQuery";

import type {
  Action,
  AttachedFile,
  CategoriesPool,
  PriorityLevel,
  TicketStatusType,
} from "../../types/createTicket.type";

import WizardStepHeader from "../ui/WizardStepHeader";
import { createTicket } from "../../api/requests";
import { mapCreateTicket } from "../../api/mappers";
import InfoModal from "./modalCardWindows/InfoModal";
import { ApiError } from "../../api/client";

interface OutletContextProps {
  reloadTickets: () => void;
}

type SubmitErrorKind = "session" | "unknown";
const ERROR_TEXTS: Record<SubmitErrorKind, string> = {
  session: "Сессия истекла. Закройте приложение и откройте его заново",
  unknown: "Не удалось отправить заявку. Попробуйте ещё раз",
};

function CreateTicketWizardLayout() {
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isMobile = useMediaQuery("(max-width: 500px)");

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  useModalStackEntry(() => setIsModalOpen((prev) => !prev));

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [multiData, setMultiData] = useState<Record<string, string[]>>({});
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesPool>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>();
  const [priority, setPriority] = useState<PriorityLevel>(null);
  const [files, setFiles] = useState<AttachedFile[]>([]);
  //NOTE: setters are for backend fetch
  const [ticketId, setTicketId] = useState<number>(542);
  const [ticketStatus, setTicketStatus] = useState<TicketStatusType>("Success");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<SubmitErrorKind | null>(null);

  const { reloadTickets } = useOutletContext<OutletContextProps>();

  const [isErrorOpen, setIsErrorOpen] = useState(false);

  // todo: make check and redirect
  // if (!selectedCategory) return {
  //   navigate("category", { replace: true })
  // }

  async function submitTicket(): Promise<boolean> {
    if (!selectedAction) return false;
    if (priority === null) return false;
    if (isSubmitting) return false;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const dto = mapCreateTicket({
        action: selectedAction,
        formData,
        priority,
      });
      await createTicket(dto);
      //NOTE: timeout for icon animation check. Should I delete it?
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setHasSubmitted(true);
      reloadTickets();
      return true;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setSubmitError("session");
      } else {
        setSubmitError("unknown");
      }
      console.error(e);
      setIsErrorOpen(true);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={`w-full ${isDesktop ? "h-full" : "h-full pt-2"}
    flex flex-col justify-center items-center
    ${isMobile ? "px-4" : "px-8"}`}
    >
      <WizardStepHeader selectedCategory={selectedCategory} />

      {/* NOTE: add overflow-y-auto to scroll only content container and make wizard static */}
      <div
        className={`w-full h-full min-h-0 flex-1 flex flex-col justify-start items-center overflow-y-auto scrollbar-none ${isDesktop ? "" : "pb-2"}`}
      >
        <Outlet
          context={{
            formData,
            setFormData,
            multiData,
            setMultiData,
            selectedCategory,
            setSelectedCategory,
            selectedAction,
            setSelectedAction,
            priority,
            setPriority,
            files,
            setFiles,
            ticketId,
            setTicketId,
            ticketStatus,
            setTicketStatus,
            isModalOpen,
            setIsModalOpen,
            submitTicket,
            hasSubmitted,
            setHasSubmitted,
            isSubmitting,
          }}
        />
      </div>

      <InfoModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        text={submitError === null ? "" : ERROR_TEXTS[submitError]}
      />
    </div>
  );
}

export default CreateTicketWizardLayout;
