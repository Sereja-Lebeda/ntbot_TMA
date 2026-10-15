import { UserContext } from "../context/UserContext";
import useUserLoader from "../hooks/useUserLoader";

function UserProvider({ children }: { children: React.ReactNode }) {
  const userState = useUserLoader();

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
}

export default UserProvider;
