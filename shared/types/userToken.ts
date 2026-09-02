import type User from "./user";
import type Notification from "./notification";

export default interface UserToken {
  usuario: User;
  notificacoes: Notification[];
  token: string;
}
