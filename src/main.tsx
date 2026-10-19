import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.disableVerticalSwipes();
tg?.expand();

if (import.meta.env.DEV) {
  import("eruda").then((m) => {
    m.default.init();
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
