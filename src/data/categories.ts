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

import accessPngLight from "../icons/createTicket/categoryIconsLight/accessPngLight.png";
import databasePngLight from "../icons/createTicket/categoryIconsLight/databasePngLight.png";
import developingPngLight from "../icons/createTicket/categoryIconsLight/developingPngLight.png";
import employeesPngLight from "../icons/createTicket/categoryIconsLight/employeesPngLight.png";
import foldersPngLight from "../icons/createTicket/categoryIconsLight/foldersPngLight.png";
import internetPngLight from "../icons/createTicket/categoryIconsLight/internetPngLight.png";
import mincerPngLight from "../icons/createTicket/categoryIconsLight/mincerPngLight.png";
import parsingPngLight from "../icons/createTicket/categoryIconsLight/parsingPngLight.png";
import pcDevicesPngLight from "../icons/createTicket/categoryIconsLight/pcDevicesPngLight.png";
import programsPngLight from "../icons/createTicket/categoryIconsLight/programsPngLight.png";
import purchasesPngLight from "../icons/createTicket/categoryIconsLight/purchasesPngLight.png";
import websitesPngLight from "../icons/createTicket/categoryIconsLight/websitesPngLight.png";

export const categories: {
  name: CategoryName;
  icon: string;
  iconLight: string;
}[] = [
  {
    name: "Доступы и коммуникация",
    icon: accessPng,
    iconLight: accessPngLight,
  },
  { name: "NTMincer", icon: mincerPng, iconLight: mincerPngLight },
  { name: "Базы данных", icon: databasePng, iconLight: databasePngLight },
  { name: "Папки и файлы", icon: foldersPng, iconLight: foldersPngLight },
  {
    name: "Компьютер и устройства",
    icon: pcDevicesPng,
    iconLight: pcDevicesPngLight,
  },
  {
    name: "Программы и сервисы",
    icon: programsPng,
    iconLight: programsPngLight,
  },
  { name: "Парсинг", icon: parsingPng, iconLight: parsingPngLight },
  { name: "Интернет", icon: internetPng, iconLight: internetPngLight },
  { name: "Сайты", icon: websitesPng, iconLight: websitesPngLight },
  { name: "Закупка", icon: purchasesPng, iconLight: purchasesPngLight },
  { name: "Сотрудники", icon: employeesPng, iconLight: employeesPngLight },
  {
    name: "Разработка и нестандартные запросы",
    icon: developingPng,
    iconLight: developingPngLight,
  },
];
