import { RouterProvider } from "react-router";
import { router } from "../router";

import ThemeProvider from "./providers/ThemeProvider";
import UserProvider from "./providers/UserProvider";
import ModalStackProvider from "./providers/ModalStackProvider";

function App() {
  return (
    <>
      <ThemeProvider>
        <UserProvider>
          <ModalStackProvider>
            <RouterProvider router={router} />
          </ModalStackProvider>
        </UserProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
