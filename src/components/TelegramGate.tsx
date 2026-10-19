import type { ReactNode } from "react";
import getInitData from "../utils/getInitData";
import OpenInTelegramPlate from "./layouts/OpenInTelegramPlate";

function TelegramGate({ children }: { children: ReactNode }) {
  const isAllowed = import.meta.env.DEV || getInitData() !== "";

  if (!isAllowed) return <OpenInTelegramPlate />;

  return <>{children}</>;
}

export default TelegramGate;
