<template>
  <v-container class="d-flex ga-2 flex-column">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-nav-icon>
          <NuxtLink
            href="/boas-vindas">
            <v-icon 
            style="background-color: #D7F2FF;"
            class="pa-4 rounded-xl"
            color="blue-dark" 
            icon="mdi-chevron-left"/>
          </NuxtLink>
        </v-app-bar-nav-icon>
        <v-app-bar-title
          class="font-weight-bold ml-2">Fazer login</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main class="d-flex flex-column ga-2">
      <p class="font-weight-bold text-h6 mb-3">Insira seus dados</p>
      <section>
        <v-text-field 
          v-model="user.email" 
          prepend-inner-icon="mdi-email-outline"
          label="E-mail" />
        <v-text-field
          v-model="user.senha"
          prepend-inner-icon="mdi-form-textbox-password"
          label="Senha"
          :type="show ? 'text' : 'password'"
          :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="show = !show"
        />
      </section>
        <NuxtLink href="/pedido-alteracao-senha" class="font-weight-bold mb-4 text-blue-dark"
        >Esqueci minha senha</NuxtLink
      >
      <v-btn @click="login">Entrar</v-btn>
      <p class="text-center">ou</p>
      <v-btn color="black" width="250" class="align-self-center" variant="outlined" @click="loginWithGoogle">
        <Icon class="mr-4" name="icons:google-logo" size="30" />
        Entrar com o Google
      </v-btn>
      <div class="text-center mt-6">
        <p>Ainda não tem uma conta?</p>
        <NuxtLink href="/registro" class="font-weight-bold mb-6 text-blue-dark">
          Cadastre-se aqui.
        </NuxtLink>
      </div>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useLoaderStore } from "~/stores/loader";
import { validateEmail } from '~/server/utils/validate';

export default defineComponent({
  name: "Login",
  data() {
    return {
      user: {
        email: "",
        senha: "",
      },
      show: false,
      auth: useAuthStore(),
      loader: useLoaderStore(),
      toast: useNuxtApp().$toast as any,
    };
  },
  methods: {
    loginWithGoogle() {
      this.loader.startLoading();
      this.auth.authenticateUserGoogle(
        async (status: number, confirmUser: boolean) => {
          if(status != 200) {
            this.toast.error("Erro ao fazer login.");
            this.loader.endLoading();
            return;
          }
          
          const permission = await Notification.requestPermission();
          if(permission == 'granted') await usePush(this.auth.user.id_usuario);

          this.$router.push(confirmUser ? "/" : "/completar-informacoes");
          this.loader.endLoading();
        }
      );
    },
    async login() {
      this.loader.startLoading();

      if (!validateEmail(this.user.email)) {
        this.toast.error("E-mail inválido.");
        this.loader.endLoading();
        return;
      }

      if(this.user.senha.length <= 0) {
        this.toast.error("Senha inválida.");
        this.loader.endLoading();
        return;        
      }

      const status = await this.auth.authenticateUser(this.user);

      if (status == 200) {
        this.$router.push("/");
        const permission = await Notification.requestPermission();
        if(permission == 'granted') await usePush(this.auth.user.id_usuario);
        return;
      }

      if (status == 401 || status == 400) {
        this.toast.error("E-mail/senha não encontrado.");
        this.loader.endLoading();
        return;
      }

      if(status == 403) {
        this.toast.error("Conta não confirmada.");
        this.loader.endLoading();
        return;
      }
      
      this.toast.error("Erro ao fazer login.");
      this.loader.endLoading();
    },
  },
});
</script>
