import { useState } from "react";

import type {
  Action,
  AttachedFile,
  PriorityLevel,
} from "../../../types/createTicket.type";
import validateForm from "../../../utils/validateForm";
import { isSameFile } from "../../../utils/fileDublicateHelper";

import TicketForm from "../../TicketForm";
import AttachmentaField from "../../ui/Attachment/AttachmentField";
import FunctionBtn from "../../ui/Buttons/FunctionBtn";

import { shadowLiftButtonStyle } from "../../../styles/shadowLift";

import BackArrowIcon from "../../../icons/createTicket/BackArrowIcon";
import ForwardArrowIcon from "../../../icons/createTicket/ForwardArrowIcon";
import SendFormIcon from "../../../icons/createTicket/SendFormIcon";

interface StepDetailsProps {
  onPrev: () => void;
  onNext: () => void;
  selectedAction: Action;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  priority: PriorityLevel;
  setPriority: (priority: PriorityLevel) => void;
  files: AttachedFile[];
  setFiles: React.Dispatch<React.SetStateAction<AttachedFile[]>>;
  multiData: Record<string, string[]>;
  setMultiData: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  submitTicket: () => void;
}

// TODO: Add network errors and others, so 4th step will have only success

function StepDetails({
  onPrev,
  onNext,
  selectedAction,
  formData,
  setFormData,
  priority,
  setPriority,
  files,
  setFiles,
  multiData,
  setMultiData,
  submitTicket,
}: StepDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);

  if (!selectedAction) return null;

  //TODO: Change validation rules to get em with Action structure from backend

  const currentErrors = validateForm(
    formData,
    multiData,
    priority,
    selectedAction,
  );
  const isFormInvalid = Object.keys(currentErrors).length > 0;

  function clearError(fieldName: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }

  function setFieldError(field: string, message: string) {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function submitForm() {
    const newErrors = validateForm(
      formData,
      multiData,
      priority,
      selectedAction,
    );
    setErrors(newErrors); // родитель ставит стейт
    if (Object.keys(newErrors).length === 0) {
      // валидно?
      submitTicket();
      onNext();
    }
  }

  function addFiles(fileList: FileList) {
    const newFiles = Array.from(fileList);
    setFiles((prev) => {
      const unique = newFiles
        .filter((nf) => !prev.some((item) => isSameFile(item.file, nf)))
        .map((nf) => ({ file: nf, url: URL.createObjectURL(nf) }));
      return [...prev, ...unique];
    });
  }

  // console.log({ multiData });
  return (
    <div className="xl:w-full">
      {/* Header */}
      <div className="xl:w-full xl:flex xl:flex-col xl:items-center xl:gap-4 xl:mb-7 xl:select-none">
        {/* Hint */}
        <span className="xl:font-jbmono xl:font-normal xl:text-xl xl:text-(--text-primary) xl:leading-5 xl:tracking-[0.8px]">
          Заполните форму
        </span>
      </div>
      <div className="xl:w-full xl:flex xl:flex-col xl:justify-center xl:items-center xl:gap-8 xl:p-12.5 xl:bg-(--bg-secondary) xl:border xl:border-(--bg-border) xl:select-none">
        {/* Top of form  */}
        <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:gap-2">
          {/* Breadcrumps */}
          <div className="xl:w-full xl:flex xl:items-center xl:gap-3 xl:py-2.5 xl:font-jbmono xl:font-normal xl:text-base xl:text-(--text-primary) xl:leading-6">
            {selectedAction.category}
            <ForwardArrowIcon className="" />
            {selectedAction.subcategory}
            <ForwardArrowIcon className="" />
            {selectedAction.name}
          </div>

          {/* Divider */}
          <div className="xl:w-full xl:h-px xl:bg-(--bg-border)"></div>
        </div>

        {/* Middle of form - fields */}
        <TicketForm
          selectedAction={selectedAction}
          formData={formData}
          setFormData={setFormData}
          multiData={multiData}
          setMultiData={setMultiData}
          priority={priority}
          setPriority={setPriority}
          errors={errors}
          clearError={clearError}
          setFieldError={setFieldError}
        />

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsDragging(false);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className="xl:w-full"
        >
          <AttachmentaField
            files={files}
            setFiles={setFiles}
            isDragging={isDragging}
            addFiles={addFiles}
          />
        </div>

        {/* Bottom of form - buttons */}
        <div className="xl:w-full xl:flex xl:flex-col xl:items-start xl:gap-7">
          {/* Divider */}
          <div className="xl:w-full xl:h-px xl:bg-(--bg-border)"></div>

          {/* Buttons */}
          <div className="xl:w-full xl:flex xl:justify-between xl:items-center">
            {/* Back btn */}
            <button
              onClick={onPrev}
              className="xl:flex xl:justify-center xl:items-center xl:gap-1 xl:py-2.25 xl:cursor-pointer xl:group"
            >
              <BackArrowIcon className="xl:text-(--text-secondary) xl:group-hover:text-(--text-primary)" />
              <span className="xl:font-jbmono xl:font-medium xl:text-(--text-secondary) xl:text-xs xl:leading-normal xl:group-hover:text-(--text-primary)">
                Назад
              </span>
            </button>

            {/* Send ticket btn */}
            <FunctionBtn
              Icon={SendFormIcon}
              iconClassName="xl:w-4.5 xl:h-4.5 xl:text-(--text-btn)"
              text="Отправить заявку"
              textClassName="xl:font-jbmono xl:font-medium xl:text-xs xl:text-(--text-btn) xl:leading-normal"
              btnClassName={`xl:h-8.5
              xl:flex xl:justify-center xl:items-center
              xl:enabled:bg-(--bg-btn-primary) xl:disabled:bg-(--bg-disable-btn)
              ${shadowLiftButtonStyle}
              `}
              innerDivClassName="xl:flex xl:justify-center xl:items-center xl:gap-2 xl:rounded-xs xl:px-4"
              onClick={submitForm}
              disabled={isFormInvalid}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepDetails;
