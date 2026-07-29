import { RouterProvider } from "react-router";
import { router } from "../router";

import ThemeProvider from "./providers/ThemeProvider";
import UserProvider from "./providers/UserProvider";

function App() {
  return (
    <>
      <ThemeProvider>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
