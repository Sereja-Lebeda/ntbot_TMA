import type { CategoryName } from "../types/createTicket.type";

import accessPng from "../icons/createTicket/categoryIconsDark/accessPng.png";
import databasePng from "../icons/createTicket/categoryIconsDark/databasePng.png";
import developingPng from "../icons/createTicket/categoryIconsDark/developingPng.png";
import employeesPng from "../icons/createTicket/categoryIconsDark/employeesPng.png";
import foldersPng from "../icons/createTicket/categoryIconsDark/foldersPng.png";
import internetPng from "../icons/createTicket/categoryIconsDark/internetPng.png";
import mincerPng from "../icons/createTicket/categoryIconsDark/mincerPng.png";
import parsingPng from "../icons/createTicket/categoryIconsDark/parsingPng.png";
import pcDevicesPng from "../icons/createTicket/categoryIconsDark/pcDevicesPng.png";
import programsPng from "../icons/createTicket/categoryIconsDark/programsPng.png";
import purchasesPng from "../icons/createTicket/categoryIconsDark/purchasesPng.png";
import websitesPng from "../icons/createTicket/categoryIconsDark/websitesPng.png";

export const categories: { name: CategoryName; icon: string }[] = [
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
