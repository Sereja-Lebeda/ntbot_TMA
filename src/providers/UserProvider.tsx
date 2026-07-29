import { UserContext } from "../context/UserContext";
import type { UserType } from "../types/user.types";
import mockUserInfo from "../../mockUserInfo.json";

function UserProvider({ children }: { children: React.ReactNode }) {
  const currentUser = mockUserInfo as UserType;

  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
}

export default UserProvider;
