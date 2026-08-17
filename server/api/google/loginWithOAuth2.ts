import { googleSdkLoaded } from "vue3-google-login";
import type UserGoogleAuth from "~/interfaces/userGoogleAuth";

type Callback = (status: number, data: any) => void;

export default function loginWithOAuth2(endRequest: Callback) {
  const config = useRuntimeConfig();
  const { $api } = useNuxtApp();

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

        const login: any = await $api("/usuarios/login/google", {
          method: "POST",
          body: auth,
        });

        responseCode = login.status;

        endRequest(responseCode, {
          tokens,
          loginRequest: login.data 
        });
      }
    }).requestCode();
  });
}