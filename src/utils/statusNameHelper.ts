type FormType = "plural" | "singular" | "statusBlock" | "infoBlock";

const titles: Record<string, Record<FormType, string>> = {
  New: {
    singular: "НОВАЯ",
    plural: "НОВЫХ",
    statusBlock: "Новые",
    infoBlock: "новых",
  },
  "In progress": {
    singular: "В РАБОТЕ",
    plural: "В РАБОТЕ",
    statusBlock: "В работе",
    infoBlock: "в работе",
  },
  Paused: {
    singular: "НА ПАУЗЕ",
    plural: "НА ПАУЗЕ",
    statusBlock: "На паузе",
    infoBlock: "на паузе",
  },
  Complete: {
    singular: "ГОТОВА",
    plural: "ГОТОВЫХ",
    statusBlock: "Готовы",
    infoBlock: "готова",
  },
  Closed: {
    singular: "ЗАКРЫТО",
    plural: "ЗАКРЫТЫХ",
    statusBlock: "Закрыты",
    infoBlock: "закрыто",
  },
  Cancelled: {
    singular: "ОТКЛОНЕНА",
    plural: "ОТКЛОНЁННЫХ",
    statusBlock: "Отклонены",
    infoBlock: "отклонена",
  },
};

export default function getStatusTitle(status: string, form: FormType) {
  return titles[status]?.[form];
}
