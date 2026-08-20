import { createBrowserRouter } from "react-router";
import Layout from "./src/components/layouts/Layout";
import HomePage from "./src/components/pages/HomePage";
import CreateTicketPage from "./src/components/pages/CreateTicketPage";
import SearchProvider from "./src/providers/SearchProvider";
import TicketViewPage from "./src/components/pages/mobile/TicketViewPage";
import TicketEditPage from "./src/components/pages/mobile/TicketEditPage";
import TicketRepeatPage from "./src/components/pages/mobile/TicketRepeatPage";
import MobileStepCategory from "./src/components/pages/ticketSteps/MobileStepCategory";
import MobileStepProblem from "./src/components/pages/ticketSteps/MobileStepProblem";
import MobileStepDetails from "./src/components/pages/ticketSteps/MobileStepDetails";
import MobileStepDone from "./src/components/pages/ticketSteps/MobileStepDone";
import CreateTicketWizardLayout from "./src/components/pages/CreateTicketWizardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SearchProvider>
        <Layout />
      </SearchProvider>
    ), // общая обёртка с хедером
    children: [
      { index: true, element: <HomePage /> }, // "/"
      // { path: "tickets/new", element: <CreateTicketPage /> },
      { path: "tickets/:ticketId", element: <TicketViewPage /> },
      { path: "tickets/:ticketId/edit", element: <TicketEditPage /> },
      { path: "tickets/:ticketId/repeat", element: <TicketRepeatPage /> },
      {
        path: "tickets/new",
        element: <CreateTicketWizardLayout />, // новый, общий для обеих версий родитель
        children: [
          { index: true, element: <CreateTicketPage /> }, // десктоп — существующий, как есть
          { path: "category", element: <MobileStepCategory /> },
          { path: "problem", element: <MobileStepProblem /> },
          { path: "details", element: <MobileStepDetails /> },
          // { path: "done", element: <MobileStepDone /> },
        ],
      },
    ],
  },
]);
