import { Fragment } from "react";

import type { CurrentStepType } from "../../types/createTicket.type";

import PassedStepIcon from "../../icons/createTicket/PassedStepIcon";

interface ProgressBarProps {
  currentStep: CurrentStepType;
}

function ProgressBar({ currentStep }: ProgressBarProps) {
  const stepsNumAndLabel: { num: CurrentStepType; label: string }[] = [
    { num: 1, label: "Категория" },
    { num: 2, label: "Проблема" },
    { num: 3, label: "Детали" },
    { num: 4, label: "Готово" },
  ];

  function getStepStyle(num: CurrentStepType) {
    if (num < currentStep) {
      return (
        <div className="w-12.5 h-12.5 rounded-xs">
          <div className="w-full h-full flex justify-center items-center bg-(--bg-secondary) border-[0.5px] border-(--border-hover-btn) rounded-xs">
            <PassedStepIcon className="text-(--border-hover-btn)" />
          </div>
        </div>
      );
    }
    if (num === currentStep) {
      return (
        <div className="relative w-12.5 h-12.5 rounded-xs">
          {/* Background */}
          <div className="absolute left-0.75 top-0.75 w-12.5 h-12.5 bg-(--border-hover-btn) rounded-xs z-0"></div>
          {/* Active step */}
          <div className="absolute w-12.5 h-12.5 flex items-center justify-center bg-(--bg-btn-primary) border-[0.5px] border-(--border-hover-btn) rounded-xs z-10">
            <span className="font-jbmono text-2xl text-(--bg-primary) font-bold leading-7.5">
              {num}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="w-12.5 h-12.5 rounded-xs">
        <div className="w-full h-full flex items-center justify-center bg-(--bg-inactive-btn) rounded-xs">
          <span className="font-jbmono text-2xl text-(--bg-primary) font-bold leading-7.5">
            {num}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-224.5 w-full flex items-start py-5 select-none">
      {stepsNumAndLabel.map((step, index) => (
        <Fragment key={step.num}>
          {/* колонка шага */}
          <div className="relative shrink-0 w-12.5 flex flex-col items-center">
            {getStepStyle(step.num)}
            <span
              className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-jbmono text-sm ${step.num === currentStep ? "text-(--text-primary)" : "text-(--border-hover-btn)"} font-normal leading-4`}
            >
              {step.label}
            </span>
          </div>

          {/* линия — отступ сверху на половину кружка (50/2=25px) */}
          {index < stepsNumAndLabel.length - 1 && (
            <div
              className={`flex-1 h-px mt-6.25 ${step.num < currentStep ? "bg-(--border-hover-btn)" : "bg-(--bg-border)"}`}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default ProgressBar;
