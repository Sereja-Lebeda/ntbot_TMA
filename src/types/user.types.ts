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

// todo: every user will have inside managerId to which manager user belongs
// todo: every user will have his fullname and surename (FIO)
