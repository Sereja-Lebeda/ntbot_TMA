import type { CategoriesPool } from "../types/createTicket.type";

export function getWizardStepMeta(selectedCategory: CategoriesPool) {
  return {
    category: {
      number: 1,
      title: "Выберите категорию",
      subtitle: "С чем у вас возникла проблема?",
    },
    problem: {
      number: 2,
      title: selectedCategory ?? "Выбранная категория",
      subtitle: "Выберите проблему или найдите через поиск",
    },
    details: { number: 3, title: "Заполните форму", subtitle: undefined },
    done: { number: 4, title: undefined, subtitle: undefined },
  };
}
