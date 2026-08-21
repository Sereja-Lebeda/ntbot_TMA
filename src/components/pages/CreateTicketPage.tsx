import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";

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
import StepProblem from "./ticketSteps/StepProblem";
import StepDone from "./ticketSteps/StepDone";

// import getTicketDescription from "../../utils/getTicketDescription";
import SupportButtons from "../ui/Buttons/SupportButtons";
import ProgressBar from "../ui/ProgressBar";
import ConfirmModal from "./modalCardWindows/ConfirmModal";

import CrossTicketIcon from "../../icons/createTicket/CrossTicketIcon";
import transferFieldValues from "../../utils/transferFieldValues";

interface OutletContextProps {
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  multiData: Record<string, string[]>;
  setMultiData: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  selectedCategory: CategoriesPool;
  setSelectedCategory: React.Dispatch<React.SetStateAction<CategoriesPool>>;
  selectedAction: Action | null | undefined;
  setSelectedAction: React.Dispatch<
    React.SetStateAction<Action | null | undefined>
  >;
  priority: PriorityLevel;
  setPriority: React.Dispatch<React.SetStateAction<PriorityLevel>>;
  files: AttachedFile[];
  setFiles: React.Dispatch<React.SetStateAction<AttachedFile[]>>;
  ticketId: number;
  setTicketId: React.Dispatch<React.SetStateAction<number>>;
  ticketStatus: TicketStatusType;
  setTicketStatus: React.Dispatch<React.SetStateAction<TicketStatusType>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  submitTicket: () => void;
}

function CreateTicketPage() {
  const [currentStep, setCurrentStep] = useState<CurrentStepType>(1);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const [formData, setFormData] = useState<Record<string, string>>({});
  // const [multiData, setMultiData] = useState<Record<string, string[]>>({});
  // const [selectedCategory, setSelectedCategory] =
  //   useState<CategoriesPool>(null);
  // const [selectedAction, setSelectedAction] = useState<Action | null>();
  // const [priority, setPriority] = useState<PriorityLevel>(null);
  // const [files, setFiles] = useState<AttachedFile[]>([]);
  // //NOTE: setters are for backend fetch
  // const [ticketId, setTicletId] = useState<number>(542);
  // const [ticketStatus, setTicketStatus] = useState<TicketStatusType>("Failed");

  const {
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
  } = useOutletContext<OutletContextProps>();

  const navigate = useNavigate();

  const inputText =
    "Вы уверены, что хотите прервать создание заявки?\n\nВведенная информация не сохранится.";

  // function submitTicket() {
  //   if (!selectedAction) return;

  //   const breadcrumbs = [
  //     selectedAction.category,
  //     selectedAction.subcategory,
  //     selectedAction.name,
  //   ];
  //   const ticket = {
  //     //TODO: userID:  NOTE: take id from db?
  //     //TODO: ticketID: NOTE: need to take id from db
  //     actionId: selectedAction.id,
  //     breadcrumbs,
  //     priority,
  //     body: formData,
  //     multiBody: multiData,
  //     description: getTicketDescription(formData, selectedAction),
  //   };

  //   const formDataToSend = new FormData(); // браузерный FormData (не стейт formData)
  //   formDataToSend.append("ticket", JSON.stringify(ticket)); // JSON тикета
  //   files.forEach((item) => {
  //     formDataToSend.append("files", item.file); // каждый файл
  //   });

  //   // TODO: fetch отправка, когда бэк готов
  //   console.log(ticket); // пока проверить сборку
  // }

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
    if (!selectedAction) {
      setFormData({});
      setMultiData({});
      return;
    }
    const { formData: newFormData, multiData: newMultiData } =
      transferFieldValues(selectedAction, action, formData, multiData);
    setFormData(newFormData);
    setMultiData(newMultiData);
  }

  function onConfirm() {
    navigate("/");
  }

  function onCancel() {
    setIsModalOpen(false);
  }

  // console.log(formData);
  return (
    <div className="xl:w-full xl:h-full xl:flex xl:flex-col xl:justify-center xl:items-center xl:min-w-130 xl:max-w-225 xl:mx-auto xl:pt-4 xl:pb-7">
      {/* Modal window  */}
      {isModalOpen && (
        <ConfirmModal
          onConfirm={onConfirm}
          onCancel={onCancel}
          inputText={inputText}
        />
      )}

      {/* Step container */}
      <div className="xl:w-full xl:flex xl:flex-col xl:items-center xl:select-none">
        {/* Title section */}
        <div className="xl:w-full xl:flex xl:justify-between xl:items-start">
          {/* Info container */}
          <div className="xl:w-2/3 xl:flex xl:flex-col xl:justify-center xl:items-start xl:gap-2">
            <span className="xl:font-jbmono xl:text-2xl xl:text-(--text-primary) xl:font-bold xl:leading-7.5">
              Создание заявки
            </span>
            <span className="xl:font-consolas xl:text-[15px] xl:text-(--text-secondary) xl:font-normal xl:leading-4.5">{`Шаг ${currentStep} из 4`}</span>
          </div>
          {/* Button */}

          {currentStep !== 4 && (
            <button
              className="xl:flex xl:justify-center xl:items-center xl:gap-1 xl:cursor-pointer xl:group xl:transition-all xl:duration-300 xl:ease-in-out xl:active:opacity-0"
              onClick={() => setIsModalOpen(true)}
            >
              <CrossTicketIcon className="xl:text-(--text-secondary) xl:group-hover:text-(--text-primary) xl:transition-colors xl:duration-300" />
              <span className="xl:font-jbmono xl:text-xs xl:text-(--text-secondary) xl:font-medium xl:leading-normal xl:group-hover:text-(--text-primary) xl:transition-colors xl:duration-300">
                Отмена
              </span>
            </button>
          )}
        </div>
        {/* Steps navigation */}
        <div className="xl:w-full xl:flex xl:justify-center xl:items-center xl:py-5 xl:mb-8">
          <ProgressBar currentStep={currentStep} />
        </div>
      </div>

      <div className="xl:w-full">
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

      <div className="xl:fixed xl:bottom-6 xl:left-6 xl:flex xl:w-83 xl:gap-2.5">
        <SupportButtons />
      </div>
    </div>
  );
}

export default CreateTicketPage;
