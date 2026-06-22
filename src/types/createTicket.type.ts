export type CurrentStepType = 1 | 2 | 3 | 4;

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

export type CategoriesPool = CategoryName | null;

export interface Action {
  id: number;
  category: CategoryName;
  subcategory: string;
  name: string;
  fields: Field;
}

interface Field {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export type FieldType = "bool" | "short text" | "long text" | "dropdown";
