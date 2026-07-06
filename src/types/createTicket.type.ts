export type CurrentStepType = 1 | 2 | 3 | 4;

export type PriorityLevel = "Low" | "Medium" | "High" | null;

export type CategoryName =
  | "Доступы и коммуникация"
  | "NTMincer"
  | "Базы данных"
  | "Папки и файлы"
  | "Компьютер и устройства"
  | "Программы и сервисы"
  | "Парсинг"
  | "Интернет"
  | "Сайты"
  | "Закупка"
  | "Сотрудники"
  | "Разработка и нестандартные запросы";

export type ValidationType = "url" | "email" | "phone" | "path";

export type AttachedFile = { file: File; url: string };

export type CategoriesPool = CategoryName | null;

export type TicketStatusType = "Success" | "Failed";

export interface Action {
  id: number;
  category: CategoryName;
  subcategory: string;
  name: string;
  attachment?: boolean;
  fields: Field[];
}

export interface Field {
  name: string; // то, под чем значение уйдёт на бэк и будет отображаться в json
  label: string; // подпись для поля, которое заполняет юзер
  type: FieldType;
  subtype?: string;
  required: boolean;
  validation?: ValidationType;
  placeholder?: string;
  options?: string[];
}

export type FieldType =
  | "short text"
  | "multi text"
  | "long text"
  | "dropdown"
  | "radio";

//Types for nested actions
export interface CategoryNode {
  category: string;
  subcategories: SubcategoryNode[];
}
export interface SubcategoryNode {
  subcategory: string;
  actions: Action[];
}
