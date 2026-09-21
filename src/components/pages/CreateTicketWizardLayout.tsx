import { Outlet } from "react-router";
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

import getTicketDescription from "../../utils/getTicketDescription";
import WizardStepHeader from "../ui/WizardStepHeader";

function CreateTicketWizardLayout() {
  const isDesktop = useMediaQuery("(min-width: 1280px)");

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

  // todo: make check and redirect
  // if (!selectedCategory) return {
  //   navigate("category", { replace: true })
  // }

  function submitTicket() {
    if (!selectedAction) return;

    const breadcrumbs = [
      selectedAction.category,
      selectedAction.subcategory,
      selectedAction.name,
    ];
    const ticket = {
      //TODO: userID:  NOTE: take id from db?
      //TODO: ticketID: NOTE: need to take id from db
      actionId: selectedAction.id,
      breadcrumbs,
      priority,
      body: formData,
      multiBody: multiData,
      description: getTicketDescription(formData, selectedAction),
    };

    const formDataToSend = new FormData(); // браузерный FormData (не стейт formData)
    formDataToSend.append("ticket", JSON.stringify(ticket)); // JSON тикета
    files.forEach((item) => {
      formDataToSend.append("files", item.file); // каждый файл
    });

    setHasSubmitted(true);

    // TODO: fetch отправка, когда бэк готов
    console.log(ticket); // пока проверить сборку
  }

  return (
    <div
      className={`w-full ${isDesktop ? "min-h-[calc(100dvh-4.5rem)] xl:min-h-0" : "min-h-dvh pt-22"}
    flex flex-col justify-center items-center px-8`}
    >
      <WizardStepHeader selectedCategory={selectedCategory} />

      <div
        className={`w-full h-full flex-1 flex flex-col justify-center items-center ${isDesktop ? "" : "justify-start pb-2"}`}
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
          }}
        />
      </div>
    </div>
  );
}

export default CreateTicketWizardLayout;
