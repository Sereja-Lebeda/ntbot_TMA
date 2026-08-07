import type { Action, PriorityLevel, Field } from "../types/createTicket.type";
import mockUserInfo from "../../mockUserInfo.json";

import { validateSingleField } from "../utils/validateForm";

import FormDropdown from "./ui/FormDropdown";
import MultiSelectDropdown from "./ui/MultiSelectDropdown";

import { btnPressAnimationStyle } from "../styles/pressAnimation";

import PlusFieldIcon from "../icons/createTicket/PlusFieldIcon";
import MinusIcon from "../icons/createTicket/MinusIcon";
import CheckRadioIcon from "../icons/createTicket/CheckRadioIcon";
import UncheckRadioIcon from "../icons/createTicket/UncheckRadioIcon";
import LowPriorityIcon from "../icons/createTicket/LowPriorityIcon";
import MidPriorityIcon from "../icons/createTicket/MidPriorityIcon";
import HighPriorityIcon from "../icons/createTicket/HighPriorityIcon";

interface TicketFormProps {
  selectedAction: Action | null;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  multiData: Record<string, string[]>;
  setMultiData: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  priority: PriorityLevel;
  setPriority: (priority: PriorityLevel) => void;
  errors: Record<string, string>;
  clearError: (field: string) => void;
  setFieldError: (field: string, message: string) => void;
}

function TicketForm({
  selectedAction,
  formData,
  setFormData,
  multiData,
  setMultiData,
  priority,
  setPriority,
  errors,
  clearError,
  setFieldError,
}: TicketFormProps) {
  if (!selectedAction) {
    return (
      <div className="xl:w-full xl:text-center xl:font-consolas xl:text-sm xl:text-(--text-secondary) xl:py-8">
        Выберите действие выше, чтобы продолжить заполнение формы
      </div>
    );
  }

  const userFullName = mockUserInfo.name;

  const defaultInputStyle = `xl:w-full xl:h-10 xl:flex xl:items-center xl:px-4 xl:py-2.5
    xl:border border-(--bg-border)
    xl:hover:border-(--border-hover-btn)
    xl:focus-within:border-(--text-primary)!
    xl:group xl:rounded-xs xl:cursor-text`;

  const priorityDivBtnStyle =
    "xl:w-35 xl:flex xl:justify-center xl:items-center xl:px-7 xl:py-3 xl:gap-2.5 xl:rounded-xs xl:cursor-pointer";
  const priorityTextBtnStyle =
    "xl:font-jbmono xl:font-extrabold xl:leading-normal xl:text-sm ";

  function renderField(field: Field) {
    switch (field.type) {
      case "short text":
        return (
          <div className="xl:w-full xl:flex xl:items-center xl:gap-3">
            <div
              className={`${defaultInputStyle}
              ${errors[field.name] ? "xl:border-(--bg-task-error)!" : ""}`}
            >
              <input
                value={formData[field.name] ?? ""}
                onBlur={() => {
                  const err = validateSingleField(field, formData, multiData);
                  if (err) {
                    setFieldError(field.name, err);
                  } else {
                    clearError(field.name);
                  }
                }}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }));
                  clearError(field.name);
                }}
                type="text"
                placeholder={field.placeholder}
                className="xl:w-full xl:font-consolas xl:font-normal xl:text-sm xl:leading-normal xl:outline-none xl:group-hover:placeholder:text-(--text-primary)"
              />
            </div>
          </div>
        );

      case "multi text": {
        const values = multiData[field.name] ?? [""];
        return (
          <div className="xl:w-full xl:flex xl:flex-col xl:gap-3">
            {values.map((value, index) => (
              <div
                key={index}
                className="xl:w-full xl:flex xl:items-center xl:gap-3"
              >
                <div
                  className={`${defaultInputStyle}
              ${errors[field.name] ? "xl:border-(--bg-task-error)!" : ""}`}
                >
                  <input
                    value={value}
                    onBlur={() => {
                      const err = validateSingleField(
                        field,
                        formData,
                        multiData,
                      );
                      if (err) {
                        setFieldError(field.name, err);
                      } else {
                        clearError(field.name);
                      }
                    }}
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
                    className="xl:w-full xl:font-consolas xl:font-normal xl:text-sm xl:leading-normal xl:outline-none"
                  />
                </div>

                <div
                  className={`xl:w-10 xl:h-10 xl:flex xl:justify-center xl:items-center
            xl:border-[0.8px] xl:border-(--bg-border)
            xl:group xl:hover:border-(--border-hover-btn) xl:cursor-pointer
            ${btnPressAnimationStyle}`}
                >
                  {index === 0 ? (
                    <button
                      className="xl:w-full xl:h-full xl:flex xl:items-center xl:justify-center xl:cursor-pointer"
                      onClick={() =>
                        setMultiData((prev) => {
                          const arr = [...(prev[field.name] ?? [""])];
                          return { ...prev, [field.name]: [...arr, ""] };
                        })
                      }
                    >
                      <PlusFieldIcon className="xl:w-4 xl:h-4 xl:text-(--text-secondary) xl:group-hover:text-(--text-primary)" />
                    </button>
                  ) : (
                    <button
                      className="xl:w-full xl:h-full xl:flex xl:items-center xl:justify-center xl:cursor-pointer"
                      onClick={() =>
                        setMultiData((prev) => {
                          const arr = (prev[field.name] ?? []).filter(
                            (_, i) => i !== index,
                          );
                          return { ...prev, [field.name]: arr };
                        })
                      }
                    >
                      <MinusIcon className="xl:w-4 xl:h-4 xl:text-(--text-secondary) xl:group-hover:text-(--text-primary)" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      }

      // TODO: Check will this auto resize work in firefox/safari
      case "long text":
        return (
          <div
            className={`xl:w-full xl:px-4 xl:py-2.5
        xl:border xl:border-(--bg-border)
        xl:hover:border-(--border-hover-btn)
        xl:focus-within:border-(--text-primary)!
        xl:group xl:rounded-xs xl:cursor-text
        ${errors[field.name] ? "xl:border-(--bg-task-error)!" : ""}`}
          >
            <textarea
              value={formData[field.name] ?? ""}
              onBlur={() => {
                const err = validateSingleField(field, formData, multiData);
                if (err) {
                  setFieldError(field.name, err);
                } else {
                  clearError(field.name);
                }
              }}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }));
                clearError(field.name);
              }}
              placeholder={field.placeholder}
              className="xl:w-full xl:min-h-20 xl:max-h-60 xl:font-consolas xl:font-normal xl:text-sm xl:leading-normal xl:outline-none xl:placeholder:text-(--text-secondary) xl:group-hover:placeholder:text-(--text-primary) xl:text-(--text-primary) xl:resize-none xl:overscroll-contain dropdown-scroll xl:field-sizing-content"
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
              const err = validateSingleField(field, formData, {
                ...multiData,
                [field.name]: val,
              });
              if (err) {
                setFieldError(field.name, err);
              } else {
                clearError(field.name);
              }
            }}
            placeholder={field.placeholder}
            hasError={!!errors[field.name]}
          />
        );
      }

      case "radio": // или внутри dropdown по флагу
        return (
          <div
            className={`xl:flex xl:items-start xl:gap-6 xl:border xl:border-transparent ${errors[field.name] ? "xl:border-(--bg-task-error)! xl:rounded-xs" : ""}`}
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
                <div className="xl:flex xl:items-center xl:cursor-pointer xl:gap-1">
                  {formData[field.name] === option ? (
                    <CheckRadioIcon />
                  ) : (
                    <UncheckRadioIcon />
                  )}
                  <span className="xl:flex xl:justify-center xl:items-center xl:p-1 xl:font-consolas xl:font-normal xl:text-sm xl:text-(--text-primary)">
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
      <div className="xl:w-full xl:flex xl:justify-start xl:items-center xl:gap-2.5">
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
              className={`${priorityDivBtnStyle} ${isActive ? "xl:border xl:border-(--text-primary)" : "xl:border xl:border-(--border-hover-btn) xl:group xl:hover:border-(--text-secondary)"} ${errors["priority"] ? "xl:border-(--bg-task-error)!" : ""}`}
            >
              <Icon
                className={`xl:shrink-0 ${isActive ? "xl:text-(--text-primary)" : "xl:text-(--border-hover-btn) xl:group-hover:text-(--text-secondary)"}`}
              />
              <span
                className={`${priorityTextBtnStyle} ${isActive ? "xl:text-(--text-primary)" : "xl:text-(--border-hover-btn) xl:group-hover:text-(--text-secondary)"}`}
              >
                {p.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="xl:w-full">
      <div className="xl:w-full xl:flex xl:flex-col xl:gap-8">
        <div className="xl:w-full xl:flex xl:flex-col xl:gap-8">
          {selectedAction.fields.map((field: Field) => (
            <div
              key={field.name}
              className="xl:w-full xl:flex xl:flex-col xl:gap-2"
            >
              <label className="xl:flex xl:items-center xl:gap-1 xl:font-consolas xl:leading-3">
                <span className="xl:font-consolas xl:font-normal xl:text-xs xl:text-(--text-secondary) xl:leading-3">
                  {field.label}
                </span>
                <span className="xl:font-consolas xl:font-normal xl:text-[15px] xl:text-(--bg-btn-primary) xl:leading-4">
                  {field.required && "*"}
                </span>
                {errors[field.name] && (
                  <span className="xl:font-consolas xl:font-normal xl:text-xs xl:text-(--bg-task-error) xl:leading-3">
                    {errors[field.name]}
                  </span>
                )}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
        <div className="xl:w-full xl:flex xl:flex-col">
          <label className="xl:font-consolas xl:font-normal xl:text-xs xl:flex xl:items-center xl:gap-0.5 xl:mb-4">
            <span className="xl:text-(--text-secondary) xl:leading-4.5">
              Приоритет
            </span>
            <span className="xl:text-(--bg-btn-primary) xl:leading-4">*</span>
          </label>
          {renderPriority()}
        </div>

        {/* Divider */}
        <div className="xl:w-full xl:h-px xl:bg-(--bg-border)"></div>
      </div>
    </div>
  );
}

export default TicketForm;
