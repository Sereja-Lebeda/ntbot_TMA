import { useNavigate, useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import useMediaQuery from "../../../hooks/useMediaQuery";

import type {
  Action,
  AttachedFile,
  PriorityLevel,
} from "../../../types/createTicket.type";

import { isSameFile } from "../../../utils/fileDublicateHelper";
import validateForm from "../../../utils/validateForm";

import AttachmentField from "../../ui/Attachment/AttachmentField";
import TicketForm from "../../TicketForm";
import FunctionBtn from "../../ui/Buttons/FunctionBtn";

import ForwardArrowIcon from "../../../icons/createTicket/ForwardArrowIcon";
import SendFormIcon from "../../../icons/createTicket/SendFormIcon";
import CrossIcon from "../../../icons/card/CrossIcon";
import { shadowLiftButtonStyle } from "../../../styles/shadowLift";
import ConfirmModal from "../modalCardWindows/ConfirmModal";

interface OutletContextProps {
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
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function MobileStepDetails() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 500px)");

  const {
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
    isModalOpen,
    setIsModalOpen,
  } = useOutletContext<OutletContextProps>();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedAction) {
      navigate("../category", { replace: true });
    }
  }, [selectedAction, navigate]);

  if (!selectedAction) return null;

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
      console.log("message");
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

  function onNext() {
    navigate("../done");
  }

  // function onPrev() {
  //   navigate("/");
  // }

  function onConfirm() {
    navigate("/");
  }

  function onCancel() {
    setIsModalOpen(false);
  }

  const inputText =
    "Вы уверены, что хотите прервать создание заявки?\n\nВведенная информация не сохранится.";

  return (
    <div className="w-full px-2 max-w-251">
      {isModalOpen && (
        <ConfirmModal
          onConfirm={onConfirm}
          onCancel={onCancel}
          inputText={inputText}
        />
      )}

      <div
        className="w-full flex flex-col justify-center items-center
      gap-8 px-5 py-6
      bg-(--bg-secondary) border border-(--bg-border) select-none"
      >
        {/* Top of form  */}
        <div className="w-full flex flex-col items-start gap-2">
          {/* Breadcrumbs */}
          <div
            className="w-full flex flex-wrap items-center gap-3
          font-jbmono font-normal text-sm text-(--text-primary)
          leading-5"
          >
            {selectedAction.category}
            <ForwardArrowIcon className="" />
            {selectedAction.subcategory}
            <ForwardArrowIcon className="" />
            {selectedAction.name}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-(--bg-border)"></div>

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
          <AttachmentField
            files={files}
            setFiles={setFiles}
            isDragging={isDragging}
            addFiles={addFiles}
          />
        </div>
      </div>

      {/* Bottom of form - buttons */}
      <div className="w-full flex flex-col items-start gap-7 px-5 py-6">
        {/* Buttons */}
        <div className="w-full flex justify-between items-center">
          {/* Back btn */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex justify-center items-center gap-1 py-2.25 cursor-pointer group select-none"
          >
            <CrossIcon className="w-2 h-2 text-(--text-secondary) group-hover:text-(--text-primary)" />
            <span className="font-jbmono font-medium text-(--text-secondary) text-xs leading-normal group-hover:text-(--text-primary)">
              Отмена
            </span>
          </button>

          {/* Send ticket btn */}
          {isMobile ? (
            <FunctionBtn
              Icon={SendFormIcon}
              iconClassName="w-4.5 h-4.5 text-(--text-btn)"
              textClassName="font-jbmono font-medium text-xs text-(--text-btn) leading-normal"
              innerDivClassName="flex justify-center items-center rounded-xs"
              btnClassName={`h-8.5
              px-3 rounded-xs
              flex justify-center items-center
              enabled:bg-(--bg-btn-primary) disabled:bg-(--bg-disable-btn)
              ${shadowLiftButtonStyle}
              `}
              onClick={submitForm}
              disabled={isFormInvalid}
            />
          ) : (
            <FunctionBtn
              Icon={SendFormIcon}
              iconClassName="w-4.5 h-4.5 text-(--text-btn)"
              text="Отправить заявку"
              textClassName="font-jbmono font-medium text-xs text-(--text-btn) leading-normal"
              innerDivClassName="flex justify-center items-center gap-2 rounded-xs px-4"
              btnClassName={`h-8.5
              flex justify-center items-center
              enabled:bg-(--bg-btn-primary) disabled:bg-(--bg-disable-btn)
              ${shadowLiftButtonStyle}
              `}
              onClick={submitForm}
              disabled={isFormInvalid}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileStepDetails;
