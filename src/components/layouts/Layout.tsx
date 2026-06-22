import { Outlet } from "react-router";
import { useState } from "react";

import type { activeSectionType } from "../../types/header.types";

import Header from "./Header";

export default function Layout() {
  const [activeSection, setActiveSection] =
    useState<activeSectionType>("tickets");

  return (
    <div
    // onMouseDown={(e) => e.preventDefault()}
    /* твой onMouseDown для blur инпута, если нужен глобально */
    >
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <Outlet /> {/* сюда подставляется страница */}
    </div>
  );
}
