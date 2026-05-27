import { useState, useEffect } from "react";

import { ThemeContext } from "../context/ThemeContext";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  // interface scheme {
  //   scheme: 'light' | "dark"
  // }

  const getInitialTheme = function () {
    if (localStorage.getItem("theme") !== null) {
      return localStorage.getItem("theme") || "light";
    } else if (Object.hasOwn(window, "Telegram")) {
      const scheme = window.Telegram.WebApp.colorScheme;
      return scheme;
    } else {
      return "light";
    }
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
