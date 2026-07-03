import { useState } from "react";

import type {
  Action,
  AttachedFile,
  Field,
  PriorityLevel,
} from "../../../types/createTicket.type";

import { validators } from "../../../utils/validators";
import FormDropdown from "../../ui/FormDropdown";
import mockUserInfo from "../../../../mockUserInfo.json";

import { btnPressAnimationStyle } from "../../../styles/pressAnimation";
import { isSameFile } from "../../../utils/fileDublicateHelper";

import BackArrowIcon from "../../../icons/createTicket/BackArrowIcon";
import ForwardArrowIcon from "../../../icons/createTicket/ForwardArrowIcon";
import PlusFieldIcon from "../../../icons/createTicket/PlusFieldIcon";
import SendFormIcon from "../../../icons/createTicket/SendFormIcon";
import UncheckRadioIcon from "../../../icons/createTicket/UncheckRadioIcon";
import CheckRadioIcon from "../../../icons/createTicket/CheckRadioIcon";
import LowPriorityIcon from "../../../icons/createTicket/LowPriorityIcon";
import MidPriorityIcon from "../../../icons/createTicket/MidPriorityIcon";
import HighPriorityIcon from "../../../icons/createTicket/HighPriorityIcon";
import AttachmentIcon from "../../../icons/createTicket/AttachmentIcon";
import AttachmentaField from "../../ui/AttachmentField";
import MinusIcon from "../../../icons/createTicket/MinusIcon";

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
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!selectedAction) return null;

  const userFullName = mockUserInfo.name;

  const priorityDivBtnStyle =
    "w-35 flex justify-center items-center px-7 py-3 gap-2.5 rounded-xs cursor-pointer";
  const priorityTextBtnStyle =
    "font-jbmono font-extrabold leading-normal text-sm ";

  const defaultInputStyle = `w-full h-10 flex items-center mt-4 px-4 py-2.5
    border border-(--bg-border)
    hover:border-(--border-hover-btn)
    focus-within:border-(--text-primary)!
    group rounded-xs cursor-text`;

  function renderField(field: Field) {
    switch (field.type) {
      case "short text":
        return (
          <div className="w-full flex items-center gap-3">
            <div
              className={`${defaultInputStyle}
              ${errors[field.name] ? "border-(--bg-task-error)!" : ""}`}
            >
              <input
                value={formData[field.name] ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }));
                  clearError(field.name);
                }}
                type="text"
                placeholder={field.placeholder}
                className="w-full
              font-consolas font-normal text-sm leading-normal
              outline-none
              group-hover:placeholder:text-(--text-primary)"
              />
            </div>
          </div>
        );

      case "multi text": {
        const values = multiData[field.name] ?? [""];
        return (
          <div className="w-full flex flex-col gap-3">
            {values.map((value, index) => (
              <div key={index} className="w-full flex items-center gap-3">
                <div
                  className={`${defaultInputStyle}
              ${errors[field.name] ? "border-(--bg-task-error)!" : ""}`}
                >
                  <input
                    value={value}
                    onChange={(e) => {
                      setMultiData((prev) => {
                        const arr = [...(prev[field.name] ?? [""])];
                        arr[index] = e.target.value;
                        return { ...prev, [field.name]: arr };
                      });
                      clearError(field.name);
                    }}
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full font-consolas font-normal text-sm leading-normal outline-none"
                  />
                </div>

                <div
                  className={`w-10 h-10 mt-4 flex justify-center items-center
            border-[0.8px] border-(--bg-border)
            group hover:border-(--border-hover-btn) cursor-pointer
            ${btnPressAnimationStyle}`}
                >
                  {index === 0 ? (
                    <button
                      className="w-full h-full
                      flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        setMultiData((prev) => {
                          const arr = [...(prev[field.name] ?? [""])];
                          return { ...prev, [field.name]: [...arr, ""] };
                        })
                      }
                    >
                      <PlusFieldIcon className="w-4 h-4 text-(--text-secondary) group-hover:text-(--text-primary)" />
                    </button>
                  ) : (
                    <button
                      className="w-full h-full
                      flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        setMultiData((prev) => {
                          const arr = (prev[field.name] ?? []).filter(
                            (_, i) => i !== index,
                          );
                          return { ...prev, [field.name]: arr };
                        })
                      }
                    >
                      <MinusIcon className="w-4 h-4 text-(--text-secondary) group-hover:text-(--text-primary)" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "long text":
        return (
          <div
            className={`h-27 ${defaultInputStyle}
              ${errors[field.name] ? "border-(--bg-task-error)!" : ""}`}
          >
            <textarea
              value={formData[field.name] ?? ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }));
                clearError(field.name);
              }}
              placeholder={field.placeholder}
              className="w-full h-full
              font-consolas font-normal text-sm leading-normal
              outline-none
              group-hover:placeholder:text-(--text-primary)
              resize-none overscroll-contain dropdown-scroll"
            ></textarea>
          </div>
        );

      case "dropdown": {
        let options = field.options ?? [];
        if (field.subtype === "employeeFullname") {
          options = ["Я", ...[...options].sort((a, b) => a.localeCompare(b))];
        }
        return (
          <FormDropdown
            options={options}
            value={formData[field.name] ?? ""}
            onChange={(val) => {
              const realValue = val === "Я" ? userFullName : val;
              setFormData((prev) => ({ ...prev, [field.name]: realValue }));
              clearError(field.name);
            }}
            placeholder={field.placeholder}
            hasError={!!errors[field.name]}
          />
        );
      }

      case "radio": // или внутри dropdown по флагу
        return (
          <div
            className={`flex items-start gap-6 py-2 mt-4 border border-transparent ${errors[field.name] ? "border-(--bg-task-error)! rounded-xs" : ""}`}
          >
            {field.options?.map((option) => (
              <label
                key={option}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, [field.name]: option }));
                  clearError(field.name);
                }}
                className=""
              >
                <div className="flex items-center cursor-pointer gap-1">
                  {formData[field.name] === option ? (
                    <CheckRadioIcon />
                  ) : (
                    <UncheckRadioIcon />
                  )}
                  <span
                    className="flex justify-center items-center p-1
              font-consolas font-normal text-sm text-(--text-primary)
              "
                  >
                    {option}
                  </span>
                </div>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  }

  function renderPriority() {
    const priorities: {
      value: PriorityLevel;
      icon: React.ComponentType<{ className?: string }>;
      label: string;
    }[] = [
      { value: "Low", icon: LowPriorityIcon, label: "Низкий" },
      { value: "Medium", icon: MidPriorityIcon, label: "Средний" },
      { value: "High", icon: HighPriorityIcon, label: "Высокий" },
    ];

    return (
      <div className="w-full flex justify-start items-center gap-2.5">
        {priorities.map((p) => {
          const Icon = p.icon;
          const isActive = priority === p.value;
          return (
            <button
              key={p.value}
              onClick={() => {
                setPriority(p.value);
                clearError("priority");
              }}
              className={`${priorityDivBtnStyle} ${isActive ? "border border-(--text-primary)" : "border border-(--border-hover-btn) group hover:border-(--text-secondary)"} ${errors["priority"] ? "border-(--bg-task-error)!" : ""}`}
            >
              <Icon
                className={`shrink-0 ${isActive ? "text-(--text-primary)" : "text-(--border-hover-btn) group-hover:text-(--text-secondary)"}`}
              />
              <span
                className={`${priorityTextBtnStyle} ${isActive ? "text-(--text-primary)" : "text-(--border-hover-btn) group-hover:text-(--text-secondary)"}`}
              >
                {p.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  function clearError(fieldName: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }

  // Drag n drop attachment
  function addFiles(fileList: FileList) {
    const newFiles = Array.from(fileList);
    setFiles((prev) => {
      const unique = newFiles
        .filter((nf) => !prev.some((item) => isSameFile(item.file, nf)))
        .map((nf) => ({ file: nf, url: URL.createObjectURL(nf) }));
      return [...prev, ...unique];
    });
  }

  //TODO: Change validation rules to get em with Action structure from backend
  function validateForm() {
    const newErrors: Record<string, string> = {};
    selectedAction.fields.forEach((field) => {
      if (field.type === "multi text") {
        const values = multiData[field.name] ?? [];

        // required: хотя бы одно непустое?
        if (field.required && values.every((v) => !v)) {
          newErrors[field.name] = "Обязательное поле";
        }

        // формат: каждый непустой элемент валиден?
        if (field.validation) {
          const hasInvalid = values.some(
            (v) => v && !validators[field.validation!](v),
          );
          if (hasInvalid) {
            newErrors[field.name] = "Неверный формат в одном из полей";
          }
        }
      } else {
        const value = formData[field.name];
        if (field.required && !value) {
          newErrors[field.name] = "Обязательное поле";
        }

        if (field.validation && value) {
          const validationResult = validators[field.validation](value);

          if (!validationResult) {
            newErrors[field.name] = "Неверный формат";
          }
        }
      }
    });

    if (!priority) {
      newErrors["priority"] = "error"; // текст не важен, раз без подсказки
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function submitForm() {
    if (validateForm()) {
      submitTicket();
      onNext();
    }
  }

  // console.log({ multiData });
  return (
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
        <div className="w-full space-y-4">
          {selectedAction.fields.map((field: Field) => (
            <div key={field.name} className="w-full flex flex-col">
              <label
                className="font-consolas font-normal text-[15px]
              flex items-center gap-0.5"
              >
                <span className="text-(--text-primary) leading-4.5">
                  {field.label}
                </span>
                <span className="text-(--bg-btn-primary) leading-4">
                  {field.required && "*"}
                </span>
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col">
          <label
            className="font-consolas font-normal text-[15px]
              flex items-center gap-0.5 mb-4"
          >
            <span className="text-(--text-primary) leading-4.5">Приоритет</span>
            <span className="text-(--bg-btn-primary) leading-4">*</span>
          </label>
          {renderPriority()}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-(--bg-border)"></div>

        {/* Attachment */}
        <div className="w-full flex flex-col items-start gap-7">
          {/* Label */}
          <div className="w-full flex items-center gap-1">
            <AttachmentIcon />
            <span className="font-jbmono font-normal text-sm text-(--text-primary) leading-5">
              Прикрепленные файлы
            </span>
          </div>

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
            {/* White background */}
            <button
              onClick={submitForm}
              className="h-8.5 flex justify-center items-center
            bg-(--text-primary) rounded-xs cursor-pointer group"
            >
              <div
                className="h-8.5 flex justify-center items-center gap-2
              bg-(--bg-btn-primary) rounded-xs px-4
              transition-all duration-600 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:z-10"
              >
                <SendFormIcon className="w-4.5 h-4.5 text-(--text-btn)" />
                <span className="font-jbmono font-medium text-xs text-(--text-btn) leading-normal">
                  Отправить заявку
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepDetails;
