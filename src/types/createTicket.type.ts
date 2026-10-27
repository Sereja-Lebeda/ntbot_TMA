export type CurrentStepType = 1 | 2 | 3 | 4;

export type PriorityLevel = "Low" | "Normal" | "High" | null;

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

export type CategoriesPool = SelectedCategory | null;

export interface SelectedCategory {
  id: number;
  name: string;
}

export interface Action {
  id: number;
  category: string;
  categoryId: number;
  subcategory: string;
  subcategoryId: number;
  name: string;
  attachment?: boolean;
  fields: Field[];
}

export interface Field {
  name: string; // то, под чем значение уйдёт на бэк и будет отображаться в json
  label: string; // подпись для поля, которое заполняет юзер
  type: FieldType;
  subtype?: string;
  condition?: string;
  defaultValue?: string;
  isInBlock?: boolean;
  required: boolean;
  validation?: ValidationType;
  placeholder?: string;
  options?: string[];
  semanticId?: string;
}

export type FieldType =
  | "short text"
  | "multi text"
  | "long text"
  | "select"
  | "multiselect"
  | "radio";

//Types for nested actions
export interface CategoryNode {
  category: CategoryName;
  categoryId: number;
  subcategories: SubcategoryNode[];
}
export interface SubcategoryNode {
  subcategory: string;
  subcategoryId: number;
  actions: Action[];
}
