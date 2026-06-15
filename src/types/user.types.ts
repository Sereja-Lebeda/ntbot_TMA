type role = "employee" | "manager" | "admin";

export interface UserType {
  id: number;
  name: string;
  role: role;
  localIp: string;
  pcName: string;
  remoteAccessDate: string;
}
