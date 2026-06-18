import { RouterProvider } from "react-router";
import { router } from "../router";

// import HomePage from "./components/pages/HomePage";
import ThemeProvider from "./providers/ThemeProvider";

function App() {
  return (
    <>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
