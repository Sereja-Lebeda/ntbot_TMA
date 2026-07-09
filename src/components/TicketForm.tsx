import { useState } from "react";

import type {
  Action,
  AttachedFile,
  PriorityLevel,
  Field,
} from "../types/createTicket.type";
import { isSameFile } from "../utils/fileDublicateHelper";
import mockUserInfo from "../../mockUserInfo.json";

import { btnPressAnimationStyle } from "../styles/pressAnimation";

import PlusFieldIcon from "../icons/createTicket/PlusFieldIcon";
import MinusIcon from "../icons/createTicket/MinusIcon";
import FormDropdown from "./ui/FormDropdown";
import CheckRadioIcon from "../icons/createTicket/CheckRadioIcon";
import UncheckRadioIcon from "../icons/createTicket/UncheckRadioIcon";
import LowPriorityIcon from "../icons/createTicket/LowPriorityIcon";
import MidPriorityIcon from "../icons/createTicket/MidPriorityIcon";
import HighPriorityIcon from "../icons/createTicket/HighPriorityIcon";
import AttachmentaField from "./ui/AttachmentField";
import AttachmentIcon from "../icons/createTicket/AttachmentIcon";
import MultiSelectDropdown from "./ui/MultiSelectDropdown";

interface TicketFormProps {
  selectedAction: Action;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  multiData: Record<string, string[]>;
  setMultiData: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  priority: PriorityLevel;
  setPriority: (priority: PriorityLevel) => void;
  files: AttachedFile[];
  setFiles: React.Dispatch<React.SetStateAction<AttachedFile[]>>;
  errors: Record<string, string>;
  clearError: (field: string) => void;
}

function TicketForm({
  selectedAction,
  formData,
  setFormData,
  multiData,
  setMultiData,
  priority,
  setPriority,
  files,
  setFiles,
  errors,
  clearError,
}: TicketFormProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const userFullName = mockUserInfo.name;

  const defaultInputStyle = `w-full h-10 flex items-center px-4 py-2.5
    border border-(--bg-border)
    hover:border-(--border-hover-btn)
    focus-within:border-(--text-primary)!
    group rounded-xs cursor-text`;

  const priorityDivBtnStyle =
    "w-35 flex justify-center items-center px-7 py-3 gap-2.5 rounded-xs cursor-pointer";
  const priorityTextBtnStyle =
    "font-jbmono font-extrabold leading-normal text-sm ";

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
                  className={`w-10 h-10 flex justify-center items-center
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

      case "select": {
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

      case "multiselect": {
        return (
          <MultiSelectDropdown
            options={field.options ?? []}
            value={multiData[field.name] ?? []}
            onChange={(val) => {
              setMultiData((prev) => ({ ...prev, [field.name]: val }));
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
            className={`flex items-start gap-6 border border-transparent ${errors[field.name] ? "border-(--bg-task-error)! rounded-xs" : ""}`}
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
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex flex-col gap-8">
          {selectedAction.fields.map((field: Field) => (
            <div key={field.name} className="w-full flex flex-col gap-2">
              <label className="flex items-center gap-0.5">
                <span className="font-consolas font-normal text-xs text-(--text-secondary) leading-3">
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
            className="font-consolas font-normal text-xs
              flex items-center gap-0.5 mb-4"
          >
            <span className="text-(--text-secondary) leading-4.5">
              Приоритет
            </span>
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

        {/* Divider */}
        {/* <div className="w-full h-px bg-(--bg-border)"></div> */}
      </div>
    </div>
  );
}

export default TicketForm;
