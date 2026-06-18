import type {
  CategoriesPool,
  CategoryName,
} from "../../../types/createTicket.type";

import CategoryGridCard from "../../ui/CategoryGridCard";

import accessPng from "../../../icons/createTicket/categoryIconsDark/accessPng.png";
import databasePng from "../../../icons/createTicket/categoryIconsDark/databasePng.png";
import developingPng from "../../../icons/createTicket/categoryIconsDark/developingPng.png";
import employeesPng from "../../../icons/createTicket/categoryIconsDark/employeesPng.png";
import foldersPng from "../../../icons/createTicket/categoryIconsDark/foldersPng.png";
import internetPng from "../../../icons/createTicket/categoryIconsDark/internetPng.png";
import mincerPng from "../../../icons/createTicket/categoryIconsDark/mincerPng.png";
import parsingPng from "../../../icons/createTicket/categoryIconsDark/parsingPng.png";
import pcDevicesPng from "../../../icons/createTicket/categoryIconsDark/pcDevicesPng.png";
import programsPng from "../../../icons/createTicket/categoryIconsDark/programsPng.png";
import purchasesPng from "../../../icons/createTicket/categoryIconsDark/purchasesPng.png";
import websitesPng from "../../../icons/createTicket/categoryIconsDark/websitesPng.png";

interface StepCategoryProps {
  onNext: () => void;
  setSelectedCategory: (category: CategoriesPool) => void;
}

function StepCategory({ onNext, setSelectedCategory }: StepCategoryProps) {
  const categories: { name: CategoryName; icon: string }[] = [
    { name: "Доступы и коммуникация", icon: accessPng },
    { name: "NTMincer", icon: mincerPng },
    { name: "Базы данных", icon: databasePng },
    { name: "Папки и файлы", icon: foldersPng },
    { name: "Компьютер и устройства", icon: pcDevicesPng },
    { name: "Программы и сервисы", icon: programsPng },
    { name: "Парсинг", icon: parsingPng },
    { name: "Интернет", icon: internetPng },
    { name: "Сайты", icon: websitesPng },
    { name: "Закупка", icon: purchasesPng },
    { name: "Сотрудники", icon: employeesPng },
    { name: "Разработка и нестандартные запросы", icon: developingPng },
  ];

  return (
    <div className="select-none">
      {/* Header component */}
      <div className="flex flex-col justify-center items-center gap-4">
        <span className="font-jbmono font-normal text-xl text-(--text-primary) leading-5 tracking-[0.8px]">
          Выберите категорию
        </span>
        <span className="font-consolas font-normal text-sm text-(--text-secondary) leading-normal">
          С чем у вас возникла проблема?
        </span>
      </div>
      {/* Grid of categories */}
      <div className=" grid grid-cols-3 gap-3 pt-7">
        {categories.map((category) => (
          <CategoryGridCard
            key={category.name}
            iconPng={category.icon}
            title={category.name}
            onClick={() => {
              setSelectedCategory(category.name);
              onNext();
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default StepCategory;
