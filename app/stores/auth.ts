import type UserToken from "~~/shared/types/userToken";
import type UserAuth from "~~/shared/types/userAuth";
import type Notification from "~~/shared/types/notification";
import type GoogleTokens from "~~/shared/types/googleTokens";
import type UserGoogleAuth from "~~/shared/types/userGoogleAuth";
import { googleSdkLoaded } from "vue3-google-login";
import { Role } from "~~/shared/types/role";
import type User from "~~/shared/types/user";
type Callback = (status: number, data: any) => void;

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
        const config = useRuntimeConfig();

        const info: any = await await useApi(
          `${config.apiBase}/usuarios/${user.id_usuario}`,
          { method: "GET" }
        );
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
      const config = useRuntimeConfig();

      const response: any = await useApi(
        `${config.apiBase}/usuarios/login/`,
        {
          method: "POST",
          body: user_auth
        }
      );

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
    async authenticateUserGoogle(endRequest: Callback) {
      const config = useRuntimeConfig();

      googleSdkLoaded((google) => {
        google.accounts.oauth2.initCodeClient({
          client_id: config.public.googleClientId,
          scope: 'email profile openid',
          callback: async (response: any) => {
            let responseCode = 400;

            const tokens: any = await $fetch(
              "https://oauth2.googleapis.com/token",
              {
                method: "POST",
                body: JSON.stringify({
                  code: response.code,
                  client_id: config.public.googleClientId,
                  client_secret: config.public.googleClientSecret,
                  redirect_uri: "postmessage",
                  grant_type: "authorization_code",
                }),
              },
            );
                    
            if(!tokens.access_token || !tokens.id_token) {
              responseCode = 400;
              endRequest(responseCode, {});
              return;
            }

            const info: any = await $fetch(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${tokens.access_token}`,
                },
              },
            );

            if(!info.email) {
              responseCode = 400;
              endRequest(responseCode, {});
              return;
            }
            
            const auth: UserGoogleAuth = {
              token: tokens.id_token as string,
              email: info.email as string
            }

            const login: any = await $fetch(`${config.apiBase}/usuarios/login/google`, {
              method: "POST",
              body: auth,
            });

            responseCode = login.status;

            const loginData = login.data;

            endRequest(responseCode, {
              tokens,
              loginRequest: loginData 
            });

            const token = useCookie("token");
            token.value = loginData.token;

            this.user = loginData.usuario;
            this.googleTokens = tokens;
            
            if(!this.user.cadastro_confirmado) endRequest(responseCode, false);
            else {
              this.notifications = loginData.notificacoes;
              endRequest(responseCode, true);
            }
          }
        }).requestCode();
      });
    },
    logUserOut() {
      const token = useCookie("token");
      this.authenticated = false;
      token.value = null;
    },
  },
});
