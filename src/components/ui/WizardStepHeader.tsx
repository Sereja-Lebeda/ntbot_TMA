import { useLocation } from "react-router";
import { categories } from "../../data/categories";
import useMediaQuery from "../../hooks/useMediaQuery";
import useTheme from "../../hooks/useTheme";
import { getWizardStepMeta } from "../../utils/wizardStepMeta";
import type {
  CategoriesPool,
  CurrentStepType,
} from "../../types/createTicket.type";

interface WizardStepHeaderProps {
  selectedCategory: CategoriesPool;
  currentStep?: CurrentStepType;
}

function WizardStepHeader({
  selectedCategory,
  currentStep,
}: WizardStepHeaderProps) {
  const { theme } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
  const isTablet = useMediaQuery("(min-width: 601px) and (max-width: 1279px)");

  const location = useLocation();
  const segments = location.pathname.split("/");
  const currentStepKey = segments[segments.length - 1];

  const stepMeta = getWizardStepMeta(selectedCategory);
  const arr = Object.entries(stepMeta);
  const foundEntry = arr.find((element) => element[1].number === currentStep);
  const stepKey = foundEntry?.[0];
  const activeStepKey = currentStep ? stepKey : currentStepKey;
  const currentMeta = stepMeta[activeStepKey as keyof typeof stepMeta];
  const categoryData = categories.find((c) => c.name === selectedCategory);

  return (
    <>
      {currentMeta && (
        // {/* Container above header: step + question (hint) */}
        <div
          className={`w-full flex flex-col justify-start items-center gap-8 select-none max-w-241
          ${isDesktop ? "py-4 " : isTablet ? "pb-3 px-2" : "pb-3  px-2"}
      
      `}
        >
          {/* Step row*/}
          <div className="w-full h-15 flex justify-start items-center gap-4">
            {/* Square w/ a step number */}
            <div
              className="w-12.5 h-12.5
            flex items-center px-4 py-2.5
  bg-(--bg-btn-primary)
  rounded-xs dark:shadow-[4px_4px_0_0_var(--border-hover-btn)]"
            >
              <span
                className="
              w-full h-full
    font-jbmono font-bold
    text-2xl text-(--bg-primary)
    leading-7.5
    "
              >
                {currentMeta.number}
              </span>
            </div>

            {/* Text of current step and step of step */}
            <div
              className="flex-1 h-full
          flex flex-col justify-center items-start
          gap-1 pt-2"
            >
              {/* Text of current step */}
              <span
                className="w-full
            font-jbmono font-bold
            text-lg text-(--text-primary)
            leading-5.5"
              >
                Создание заявки
              </span>

              {/* Step of step */}
              <span
                className="w-full
            font-consolas font-normal
            text-sm text-(--text-secondary)
            leading-normal"
              >{`Шаг ${currentMeta.number} из 4`}</span>
            </div>
          </div>

          {/* Question for current step (hint) */}
          <div
            className="w-full
        flex flex-col justify-center items-start
        gap-2"
          >
            {/* Icon category and category */}
            {activeStepKey === "problem" ? (
              <div
                className="w-full
          flex items-center gap-3"
              >
                <img
                  src={
                    theme === "light"
                      ? categoryData?.iconLight
                      : categoryData?.icon
                  }
                  alt=""
                  className="bg-(--text-primary) rounded-xs w-3 h-3"
                />
                <span
                  className="w-full
            font-jbmono font-normal
            text-base text-(--text-primary)
            leading-6"
                >
                  {currentMeta.title}
                </span>
              </div>
            ) : (
              <div
                className="w-full
          flex items-center gap-3"
              >
                <span
                  className="w-full
            font-jbmono font-normal
            text-base text-(--text-primary)
            leading-6"
                >
                  {currentMeta.title}
                </span>
              </div>
            )}
            <span
              className="w-full
          font-consolas font-normal
          text-base text-(--text-secondary)
          leading-4"
            >
              {currentMeta.subtitle}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default WizardStepHeader;
