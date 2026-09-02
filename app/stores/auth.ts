import type UserToken from "~~/shared/types/userToken";
import type UserAuth from "~~/shared/types/userAuth";
import type Notification from "~~/shared/types/notification";
import type GoogleTokens from "~~/shared/types/googleTokens";
import getUserInfo from "~/server/api/user/getUserInfo";
import login from "~/server/api/login/login";
import loginWithOAuth2 from "~/server/api/google/loginWithOAuth2";
import { Role } from "~~/shared/types/role";
import type User from "~~/shared/types/user";
type Callback = (status: number, confirmRegister: boolean) => void;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: { } as User,
    authenticated: false,
    notifications: [] as Notification[],
    notReadNotifications: 0, 
    page: '/',
    googleTokens: {} as GoogleTokens,
  }),
  actions: {
    async refreshAuth() {
      try {
        const info: any = await getUserInfo(user.id_usuario);
        if(info.status != 200) return { status: info.status };

        const data = info.data;
        if(!data.usuario.cadastro_confirmado) return { status: 403 };

        this.notifications = data.notificacoes;
        Object.assign(this.user, data.usuario);

        this.authenticated = true;

        const notReadNotifications: Notification[] = this.notifications.filter(
          (notification) => !notification.lida,
        );

        this.notReadNotifications = notReadNotifications.length;
      } catch(error: any) {
        console.error(error.status);
        return { status: error.status };
      }
      return { status: 200 };
    },
    async authenticateUser(user_auth: UserAuth) {
      const response: any = await login(user_auth);

      if (response.status == 200) {
        const data: UserToken = response.data;

        const token = useCookie("token");
        token.value = data.token;
        
        this.user = data.usuario;
        this.notifications = data.notificacoes;
        this.user.role = Role.User;
      }
      
      return response.status;
    },
    async authenticateUserGoogle(callback: Callback) {     
      loginWithOAuth2(async (status: number, data: any) => {
        if(status != 200) {
          callback(status, false);
          return;
        }

        const token = useCookie("token");
        token.value = data.loginRequest.token;

        this.user = data.loginRequest.usuario;
        this.googleTokens = data.tokens;
        
        if(!this.user.cadastro_confirmado) callback(status, false);
        else {
          this.notifications = data.notificacoes;
          callback(status, true);
        }
      });
    },
    logUserOut() {
      const token = useCookie("token");
      this.authenticated = false;
      token.value = null;
    },
  },
});
