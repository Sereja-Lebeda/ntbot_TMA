import { createContext } from "react";
import type { UserContextValue } from "../types/user.types";

export const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: true,
  error: null,
  reload: () => {},
});
