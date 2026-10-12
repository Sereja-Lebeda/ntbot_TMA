import { useEffect } from "react";
import { useLocation } from "react-router";
import useGoBack from "./useGoBack";

function useTelegramBackButton() {
  const location = useLocation();
  const goBack = useGoBack();

  const isRoot = location.pathname === "/";

  useEffect(() => {
    const backButton = window.Telegram.WebApp.BackButton;

    // 1. Если мы на главной: спрятать кнопку и выйти из эффекта.
    if (isRoot) {
      backButton.hide();
      return;
    }

    // 2. Показать кнопку и подписать через onClick.
    backButton.show();
    backButton.onClick(goBack);

    // 3. Вернуть cleanup-функцию, которая снимает через offClick.
    return () => {
      backButton.offClick(goBack);
    };
  }, [isRoot, goBack]);
}

export default useTelegramBackButton;
