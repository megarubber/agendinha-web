import type UserToken from "~~/shared/types/userToken";
import type UserAuth from "~~/shared/types/userAuth";
import type Notification from "~~/shared/types/notification";
import { googleSdkLoaded } from "vue3-google-login";
import type { User } from "~~/shared/types/user";
import { useLoaderStore } from "~/stores/loader";

type Callback = (status: number, data: any) => void;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {} as User,
    authenticated: false,
    notifications: [] as Notification[],
    notReadNotifications: 0, 
    page: '/',
    accessToken: '' as string,
  }),
  actions: {
    async refreshAuth() {
      try {
        const { $api } = useNuxtApp();
        const token = useCookie("token");
        const info: any = await $api('/usuarios', 
          { 
            method: "GET",
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          }
        );
        
        if(info.status != 200) return { status: info.status };

        const data = info.data;
        if(!data.usuario.cadastro_confirmado) return { status: 403 };

        this.notifications = data.notificacoes;
        this.user = data.usuario;
        this.authenticated = true;

        const notReadNotifications: Notification[] = this.notifications.filter(
          (notification) => !notification.lida,
        );

        this.notReadNotifications = notReadNotifications.length;
      } catch(error: any) {
        console.error("refreshAuth failed:", error?.statusCode, error?.message, error?.data);
        return { status: error.status };
      }
      return { status: 200 };
    },
    async authenticateUser(user_auth: UserAuth) {
      const { $api } = useNuxtApp();

      const response: any = await $api('/usuarios/login',
        { method: "POST", body: user_auth }
      );

      if (response.status == 200) {
        const data: UserToken = response.data;
        const token = useCookie("token");
        token.value = data.token;
        this.user = data.usuario;
        this.notifications = data.notificacoes;
      }
      
      return { status: response.status, data: response.data };
    },
    async authenticateUserGoogle(endRequest: Callback) {
      const config = useRuntimeConfig();
      const { $api } = useNuxtApp();
      const loader = useLoaderStore();
    
      googleSdkLoaded((google) => {
        google.accounts.oauth2.initCodeClient({
          client_id: config.public.googleClientId,
          scope: 'email profile openid https://www.googleapis.com/auth/calendar.events',
          ux_mode: 'popup',
          callback: async (response: any) => {
            if (response.error || !response.code) {
              endRequest(400, { data: { message: 'Login com Google cancelado' } });
              return;
            }
    
            let responseCode;
            loader.startLoading();
    
            try {
              const login: any = await $api('/usuarios/login/google', {
                method: "POST",
                body: {
                  code: response.code,
                },
              });
    
              responseCode = login.status;
              const data = login.data;
    
              const token = useCookie("token");
              token.value = data.token;
    
              this.user = data.usuario;
              this.notifications = data.notificacoes;
              this.accessToken = data.google_access_token ?? null;
    
              endRequest(responseCode, { data });
            } catch (err: any) {
              endRequest(err?.statusCode ?? err?.status ?? 500, {
                data: { message: err?.data?.message ?? 'Erro ao autenticar com o Google' },
              });
            } finally {
              loader.endLoading();
            }
          },
          error_callback: () => {
            endRequest(400, { data: { message: 'Não foi possível abrir o login do Google' } });
          },
        }).requestCode();
      });
    },
    logout() {
      const token = useCookie("token");
      this.authenticated = false;
      this.user = {} as User;
      token.value = null;
    },
  },
});
