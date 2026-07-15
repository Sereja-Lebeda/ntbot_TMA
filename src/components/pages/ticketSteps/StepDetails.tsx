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

// TODO: Add feat to save info in fields until user cancel/submit ticket
// TODO: Try to find out is it possible to transfer info from one action to another with same fields
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
    <div className="w-full">
      {/* Header */}
      <div className="w-full flex flex-col items-center gap-4 mb-7 select-none">
        {/* Hint */}
        <span className="font-jbmono font-normal text-xl text-(--text-primary) leading-5 tracking-[0.8px]">
          Заполните форму
        </span>
      </div>
      <div
        className="w-full flex flex-col justify-center items-center gap-8 p-12.5
      bg-(--bg-secondary) border border-(--bg-border) select-none"
      >
        {/* Top of form  */}
        <div className="w-full flex flex-col items-start gap-2">
          {/* Breadcrumps */}
          <div
            className="w-full flex items-center gap-3 py-2.5
          font-jbmono font-normal text-base text-(--text-primary) leading-6"
          >
            {selectedAction.category}
            <ForwardArrowIcon className="" />
            {selectedAction.subcategory}
            <ForwardArrowIcon className="" />
            {selectedAction.name}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-(--bg-border)"></div>
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
          className="w-full"
        >
          <AttachmentaField
            files={files}
            setFiles={setFiles}
            isDragging={isDragging}
            addFiles={addFiles}
          />
        </div>

        {/* Bottom of form - buttons */}
        <div className="w-full flex flex-col items-start gap-7">
          {/* Divider */}
          <div className="w-full h-px bg-(--bg-border)"></div>

          {/* Buttons */}
          <div className="w-full flex justify-between items-center">
            {/* Back btn */}
            <button
              onClick={onPrev}
              className="flex justify-center items-center gap-1 py-2.25 cursor-pointer group"
            >
              <BackArrowIcon className="text-(--text-secondary) group-hover:text-(--text-primary)" />
              <span className="font-jbmono font-medium text-(--text-secondary) text-xs leading-normal group-hover:text-(--text-primary)">
                Назад
              </span>
            </button>

            {/* Send ticket btn */}
            <FunctionBtn
              Icon={SendFormIcon}
              iconClassName="w-4.5 h-4.5 text-(--text-btn)"
              text="Отправить заявку"
              textClassName="font-jbmono font-medium text-xs text-(--text-btn) leading-normal"
              btnClassName={`h-8.5
              flex justify-center items-center
              enabled:bg-(--bg-btn-primary) disabled:bg-(--bg-disable-btn)
              ${shadowLiftButtonStyle}

              `}
              innerDivClassName="flex justify-center items-center gap-2 rounded-xs px-4"
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
