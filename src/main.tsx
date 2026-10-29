import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { getCatalog } from "./api/requests.ts";

const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.disableVerticalSwipes();
tg?.expand();

if (import.meta.env.DEV) {
  import("eruda").then((m) => {
    m.default.init();
  });
}

getCatalog().catch(() => {});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
