import { createContext } from "react";
import type { UserType } from "../types/user.types";

export const UserContext = createContext<UserType | null>(null);
