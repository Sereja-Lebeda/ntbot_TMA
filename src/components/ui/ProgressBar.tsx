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
        <div className="xl:w-12.5 xl:h-12.5 xl:rounded-xs">
          <div className="xl:w-full xl:h-full xl:flex xl:justify-center xl:items-center xl:bg-(--bg-secondary) xl:border-[0.5px] xl:border-(--border-hover-btn) xl:rounded-xs">
            <PassedStepIcon className="xl:text-(--border-hover-btn)" />
          </div>
        </div>
      );
    }
    if (num === currentStep) {
      return (
        <div className="xl:relative xl:w-12.5 xl:h-12.5 xl:rounded-xs">
          {/* Background */}
          <div className="xl:absolute xl:left-0.75 xl:top-0.75 xl:w-12.5 xl:h-12.5 xl:bg-(--border-hover-btn) xl:rounded-xs xl:z-0"></div>
          {/* Active step */}
          <div className="xl:absolute xl:w-12.5 xl:h-12.5 xl:flex xl:items-center xl:justify-center xl:bg-(--bg-btn-primary) xl:border-[0.5px] xl:border-(--border-hover-btn) xl:rounded-xs xl:z-10">
            <span className="xl:font-jbmono xl:text-2xl xl:text-(--bg-primary) xl:font-bold xl:leading-7.5">
              {num}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="xl:w-12.5 xl:h-12.5 xl:rounded-xs">
        <div className="xl:w-full xl:h-full xl:flex xl:items-center xl:justify-center xl:bg-(--bg-inactive-btn) xl:rounded-xs">
          <span className="xl:font-jbmono xl:text-2xl xl:text-(--bg-primary) xl:font-bold xl:leading-7.5">
            {num}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:max-w-224.5 xl:w-full xl:flex xl:items-start xl:py-5 xl:select-none">
      {stepsNumAndLabel.map((step, index) => (
        <Fragment key={step.num}>
          {/* колонка шага */}
          <div className="xl:relative xl:shrink-0 xl:w-12.5 xl:flex xl:flex-col xl:items-center">
            {getStepStyle(step.num)}
            <span
              className={`xl:absolute xl:top-full xl:mt-2 xl:left-1/2 xl:-translate-x-1/2 xl:whitespace-nowrap xl:font-jbmono xl:text-sm ${step.num === currentStep ? "xl:text-(--text-primary)" : "xl:text-(--border-hover-btn)"} xl:font-normal xl:leading-4`}
            >
              {step.label}
            </span>
          </div>

          {/* линия — отступ сверху на половину кружка (50/2=25px) */}
          {index < stepsNumAndLabel.length - 1 && (
            <div
              className={`xl:flex-1 xl:h-px xl:mt-6.25 ${step.num < currentStep ? "xl:bg-(--border-hover-btn)" : "xl:bg-(--bg-border)"}`}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default ProgressBar;
