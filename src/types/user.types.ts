export type UserRole = "employee" | "manager" | "admin";

export interface UserType {
  id: number;
  name: string;
  role: UserRole;
  department: string;
  localIp: string;
  pcName: string;
  remoteAccessDate: string;
}

export interface UserContextValue {
  user: UserType | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
}
