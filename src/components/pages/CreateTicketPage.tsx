import { useState } from "react";
import { useNavigate } from "react-router";

import type {
  CurrentStepType,
  CategoriesPool,
  Action,
  PriorityLevel,
  AttachedFile,
  TicketStatusType,
} from "../../types/createTicket.type";

import StepCategory from "./ticketSteps/StepCategory";
import StepDetails from "./ticketSteps/StepDetails";

import SupportButtons from "../ui/SupportButtons";
import ProgressBar from "../ui/ProgressBar";
import CrossTicketIcon from "../../icons/createTicket/CrossTicketIcon";
import StepProblem from "./ticketSteps/StepProblem";
import StepDone from "./ticketSteps/StepDone";
import ModalWindow from "../ui/ModalWindow";

// type LabelStepProps = "Category" | "Problem" | "Details" | "Done";

function CreateTicketPage() {
  const [currentStep, setCurrentStep] = useState<CurrentStepType>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [multiData, setMultiData] = useState<Record<string, string[]>>({});
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesPool>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>();
  const [priority, setPriority] = useState<PriorityLevel>(null);
  // const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [ticketId, setTicletId] = useState<number>(542);
  const [ticketStatus, setTicketStatus] = useState<TicketStatusType>("Failed");

  const navigate = useNavigate();

  const inputText =
    "Вы уверены, что хотите прервать создание заявки?\n\nВведенная информация не сохранится.";

  function submitTicket() {
    if (!selectedAction) return;

    const body = {
      ...formData,
      ...multiData,
    };
    const breadcrumbs = [
      selectedAction.category,
      selectedAction.subcategory,
      selectedAction.name,
    ];
    const ticket = {
      //TODO: userID:  NOTE: take id from db?
      //TODO: ticketID: NOTE: need to take id from db
      actionID: selectedAction.id,
      ticketName: selectedAction.name,
      breadcrumbs: breadcrumbs,
      priority: priority,
      body: body,
    };

    const formDataToSend = new FormData(); // браузерный FormData (не стейт formData)
    formDataToSend.append("ticket", JSON.stringify(ticket)); // JSON тикета
    files.forEach((item) => {
      formDataToSend.append("files", item.file); // каждый файл
    });

    // TODO: fetch отправка, когда бэк готов
    console.log(ticket); // пока проверить сборку
  }

  function nextStep() {
    setCurrentStep((prev) =>
      prev < 4 ? ((prev + 1) as CurrentStepType) : prev,
    );
  }
  function prevStep() {
    setCurrentStep((prev) =>
      prev > 1 ? ((prev - 1) as CurrentStepType) : prev,
    );
  }

  function selectAction(action: Action) {
    setSelectedAction(action);
    setFormData({});
  }

  function onConfirm() {
    navigate("/");
  }

  function onCancel() {
    setIsModalOpen(false);
  }

  // console.log(formData);
  return (
    <div className="flex flex-col justify-center items-center min-w-130 max-w-225 mx-auto pt-4 pb-7">
      {/* Modal window  */}
      {isModalOpen && (
        <ModalWindow
          onConfirm={onConfirm}
          onCancel={onCancel}
          inputText={inputText}
        />
      )}

      {/* Step container */}
      <div className="w-full flex flex-col items-center select-none">
        {/* Title section */}
        <div className="w-full flex justify-between items-start ">
          {/* Info container */}
          <div className="w-2/3 flex flex-col justify-center items-start gap-2">
            <span className="font-jbmono text-2xl text-(--text-primary) font-bold leading-7.5">
              Создание заявки
            </span>
            <span className="font-consolas text-[15px] text-(--text-secondary) font-normal leading-4.5">{`Шаг ${currentStep} из 4`}</span>
          </div>
          {/* Button */}

          {currentStep !== 4 && (
            <button
              className={`flex justify-center items-center gap-1 cursor-pointer group transition-all duration-300 ease-in-out active:opacity-0`}
              onClick={() => setIsModalOpen(true)}
            >
              <CrossTicketIcon
                className={`text-(--text-secondary) group-hover:text-(--text-primary) transition-colors duration-300`}
              />
              <span
                className={`font-jbmono text-xs text-(--text-secondary) font-medium leading-normal group-hover:text-(--text-primary) transition-colors duration-300`}
              >
                Отмена
              </span>
            </button>
          )}
        </div>
        {/* Steps navigation */}
        <div className="w-full flex justify-center items-center py-5 mb-8">
          <ProgressBar currentStep={currentStep} />
        </div>
      </div>

      <div className="w-full">
        {currentStep === 1 && (
          <StepCategory
            onNext={nextStep}
            setSelectedCategory={setSelectedCategory}
          />
        )}
        {currentStep === 2 && (
          <StepProblem
            onPrev={prevStep}
            onNext={nextStep}
            selectedCategory={selectedCategory}
            selectAction={selectAction}
          />
        )}
        {currentStep === 3 && selectedAction && (
          <StepDetails
            onPrev={prevStep}
            onNext={nextStep}
            selectedAction={selectedAction}
            formData={formData}
            setFormData={setFormData}
            priority={priority}
            setPriority={setPriority}
            files={files}
            setFiles={setFiles}
            multiData={multiData}
            setMultiData={setMultiData}
            submitTicket={submitTicket}
          />
        )}
        {currentStep === 4 && (
          <StepDone ticketId={ticketId} ticketStatus={ticketStatus} />
        )}
      </div>

      <div className="fixed bottom-6 left-6 flex w-83 gap-2.5">
        <SupportButtons />
      </div>
    </div>
  );
}

export default CreateTicketPage;
