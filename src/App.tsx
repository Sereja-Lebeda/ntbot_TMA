import { RouterProvider } from "react-router";
import { router } from "../router";

import ThemeProvider from "./providers/ThemeProvider";
import UserProvider from "./providers/UserProvider";
import ModalStackProvider from "./providers/ModalStackProvider";
import TelegramGate from "./components/TelegramGate";

function App() {
  return (
    <>
      <ThemeProvider>
        <TelegramGate>
          <UserProvider>
            <ModalStackProvider>
              <RouterProvider router={router} />
            </ModalStackProvider>
          </UserProvider>
        </TelegramGate>
      </ThemeProvider>
    </>
  );
}

export default App;
