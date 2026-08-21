import { Outlet, useLocation } from "react-router";
import { useState } from "react";
import useModalStackEntry from "../../hooks/useModalStackEntry";
import useTheme from "../../hooks/useTheme";
import useMediaQuery from "../../hooks/useMediaQuery";

import type {
  Action,
  AttachedFile,
  CategoriesPool,
  PriorityLevel,
  TicketStatusType,
} from "../../types/createTicket.type";

import { categories } from "../../data/categories";
import getTicketDescription from "../../utils/getTicketDescription";

function CreateTicketWizardLayout() {
  const { theme } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  useModalStackEntry(() => setIsModalOpen((prev) => !prev));

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [multiData, setMultiData] = useState<Record<string, string[]>>({});
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesPool>(null);
  const [selectedAction, setSelectedAction] = useState<Action | null>();
  const [priority, setPriority] = useState<PriorityLevel>(null);
  const [files, setFiles] = useState<AttachedFile[]>([]);
  //NOTE: setters are for backend fetch
  const [ticketId, setTicketId] = useState<number>(542);
  const [ticketStatus, setTicketStatus] = useState<TicketStatusType>("Success");

  const location = useLocation();
  const segments = location.pathname.split("/");
  const currentStepKey = segments[segments.length - 1];

  const stepMeta = {
    category: {
      number: 1,
      title: "Выберите категорию",
      subtitle: "С чем у вас возникла проблема?",
    },
    problem: {
      number: 2,
      title: `${selectedCategory ?? "Выбранная категория"}`,
      subtitle: "Выберите проблему или найдите через поиск",
    },
    details: { number: 3, title: "Заполните форму", subtitle: undefined },
    done: { number: 4, title: undefined, subtitle: undefined },
  };

  const currentMeta = stepMeta[currentStepKey as keyof typeof stepMeta];

  const categoryData = categories.find((c) => c.name === selectedCategory);

  // todo: make check and redirect
  // if (!selectedCategory) return {
  //   navigate("category", { replace: true })
  // }

  function submitTicket() {
    if (!selectedAction) return;

    const breadcrumbs = [
      selectedAction.category,
      selectedAction.subcategory,
      selectedAction.name,
    ];
    const ticket = {
      //TODO: userID:  NOTE: take id from db?
      //TODO: ticketID: NOTE: need to take id from db
      actionId: selectedAction.id,
      breadcrumbs,
      priority,
      body: formData,
      multiBody: multiData,
      description: getTicketDescription(formData, selectedAction),
    };

    const formDataToSend = new FormData(); // браузерный FormData (не стейт formData)
    formDataToSend.append("ticket", JSON.stringify(ticket)); // JSON тикета
    files.forEach((item) => {
      formDataToSend.append("files", item.file); // каждый файл
    });

    setHasSubmitted(true);

    // TODO: fetch отправка, когда бэк готов
    console.log(ticket); // пока проверить сборку
  }

  return (
    <div
      className={`w-full ${isDesktop ? "min-h-[calc(100dvh-4.5rem)] xl:min-h-0" : "min-h-dvh"}
    flex flex-col justify-center items-center`}
    >
      {currentMeta && (
        // {/* Container above header: step + question (hint) */}
        <div
          className={`w-full flex flex-col justify-start items-center gap-8 select-none
          ${isDesktop ? "py-4 max-w-241" : "pt-22 pb-3 px-5 max-w-251"}
      
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
            {currentStepKey === "problem" ? (
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

      <div
        className={`w-full flex-1 flex flex-col justify-center items-center ${isDesktop ? "" : "pb-20"}`}
      >
        <Outlet
          context={{
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
            hasSubmitted,
            setHasSubmitted,
          }}
        />
      </div>
    </div>
  );
}

export default CreateTicketWizardLayout;
