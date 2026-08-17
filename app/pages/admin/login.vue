<template>
  <v-container class="d-flex ga-2 flex-column pb-16">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-title class="font-weight-bold ml-2">Recepção</v-app-bar-title>
      </template>
    </v-app-bar>
    <div class="d-flex flex-column ga-2 pt-4">
      <p class="font-weight-bold text-h6 mb-3">Acesso restrito</p>
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
        @keyup.enter="login"
      />
      <v-btn class="w-100" :loading="loader.isLoading" @click="login">
        Entrar
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts">
import { useAuthStore } from "~/app/store/auth";
import { useLoaderStore } from "~/app/store/loader";
import { validateEmail } from '~/server/utils/others/validate';

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
    async login() {
      this.loader.startLoading();
    },
  },
});
</script>