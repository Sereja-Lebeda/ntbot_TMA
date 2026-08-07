import { createBrowserRouter } from "react-router";
import Layout from "./src/components/layouts/Layout";
import HomePage from "./src/components/pages/HomePage";
import CreateTicketPage from "./src/components/pages/CreateTicketPage";
import SearchProvider from "./src/providers/SearchProvider";

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
      { path: "tickets/new", element: <CreateTicketPage /> },
    ],
  },
]);
