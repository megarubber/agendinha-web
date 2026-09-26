<template>
  <v-container class="d-flex ga-2 flex-column">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-nav-icon>
          <NuxtLink
            href="/login">
            <v-icon 
            style="background-color: #D7F2FF;"
            class="pa-4 rounded-xl"
            color="blue-dark" 
            icon="mdi-chevron-left"/>
          </NuxtLink>
        </v-app-bar-nav-icon>
        <v-app-bar-title
          class="font-weight-bold ml-2">Criar conta</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main>
      <p class="font-weight-bold text-h6 mb-3">Insira seus dados</p>
      <section>
        <v-mask-input
          v-model="user.cpf"
          prepend-inner-icon="mdi-badge-account-horizontal-outline"
          label="CPF"
          mask="###.###.###-##"
        />
        <v-text-field 
          v-model="user.email" 
          prepend-inner-icon="mdi-email-outline"
          label="E-mail"
          />
        <v-text-field
          v-model="user.senha"
          prepend-inner-icon="mdi-form-textbox-password"
          label="Senha"
          :type="show ? 'text' : 'password'"
          :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="show = !show"
        />
      </section>
      <v-btn class="w-100" @click="register()">Criar conta</v-btn>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import { useLoaderStore } from "~/stores/loader";
import type UserRegister from "~~/shared/types/userRegister";
import { useAuthStore } from "~/stores/auth";

export default defineComponent({
  name: "Registro",
  data() {
    return {
      user: {
        email: "",
        senha: "",
        cpf: "",
      } as UserRegister,
      show: false,
      loader: useLoaderStore(),
      toast: useNuxtApp().$toast as any,
      auth: useAuthStore(),
    };
  },
  methods: {
    async register() {
      this.loader.startLoading();

      const testEmail =
        /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      
      if (!testEmail.test(this.user.email)) {
        this.toast.error("E-mail inválido.");
        this.loader.endLoading();
        return;
      }

      if(this.user.cpf.length != 11) {
        this.toast.error("CPF inválido.");
        this.loader.endLoading();
        return;
      }

      if (this.user.senha.length <= 0) {
        this.toast.error("Senha inválida.");
        this.loader.endLoading();
        return;
      }
      const { $api } = useNuxtApp();
      this.user.cpf = this.user.cpf.replace(/[^0-9]/g, ''); 
      const response: any = await $api(
        "/usuarios/registrar",
        {
          method: "POST",
          body: this.user
        }
      );
      if(response.status == 200) this.$router.push("/login");
      else this.toast.error("Erro ao fazer o cadastro.");

      this.loader.endLoading();
    },
  },
});
</script>
