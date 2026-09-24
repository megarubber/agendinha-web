<template>
  <v-container>
    <v-app-bar>
      <template #prepend>
        <v-app-bar-nav-icon>
          <NuxtLink
            href="/editar-perfil">
            <v-icon 
            style="background-color: #D7F2FF;"
            class="pa-4 rounded-xl"
            color="blue-dark"
            icon="mdi-chevron-left"/>
          </NuxtLink>
        </v-app-bar-nav-icon>
        <v-app-bar-title
          class="font-weight-bold ml-2">Alterar senha</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main>
      <v-text-field
        v-model="user.senhaAtual.value"
        label="Senha atual"
        :type="user.senhaAtual.show ? 'text' : 'password'"
        :append-inner-icon="user.senhaAtual.show ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="user.senhaAtual.show = !user.senhaAtual.show"
        />
      <p class="text-h7 mb-2">Esqueci minha senha</p>
      <v-text-field
        v-model="user.novaSenha.value" 
        label="Nova Senha"
        :type="user.novaSenha.show ? 'text' : 'password'"
        :append-inner-icon="user.novaSenha.show ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="user.novaSenha.show = !user.novaSenha.show"
        />
      <v-text-field
        v-model="user.confirmarNovaSenha.value" 
        label="Confirmar Senha"
        :type="user.confirmarNovaSenha.show ? 'text' : 'password'"
        :append-inner-icon="user.confirmarNovaSenha.show ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="user.confirmarNovaSenha.show = !user.confirmarNovaSenha.show"
        />
      <v-btn 
        class="w-100"
        @click="updatePassword"
        >Alterar Senha</v-btn>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import type UserNewPasswordWithLogin from "~~/shared/types/userNewPasswordWithLogin";
import { useAuthStore } from "~/stores/auth";
import { useLoaderStore } from "~/stores/loader";

export default defineComponent({
  name: "UpdatePassword",
  setup() {
    definePageMeta({ middleware: "auth" });
  },
  data() {
    return {
      user: {
        senhaAtual: {
          value: "",
          show: false
        },
        novaSenha: {
          value: "",
          show: false
        },
        confirmarNovaSenha: {
          value: "",
          show: false
        },
      },
      auth: storeToRefs(useAuthStore()),
      loader: useLoaderStore(),
      toast: useNuxtApp().$toast as any,
    };
  },
  methods: {
    async updatePassword() {
      this.loader.startLoading();
      try {
        if(this.user.novaSenha.value != this.user.confirmarNovaSenha.value) {
          this.toast.error("Senhas não são iguais.");
          this.loader.endLoading();
          return;
        }

        const body: UserNewPasswordWithLogin = {
          id: this.auth.user.id_usuario,
          senha_atual: this.user.senhaAtual.value,
          senha_nova: this.user.novaSenha.value
        }

        const { $api } = useNuxtApp();

        const response: any = await $api("/usuarios/redefinir-senha", {
          method: "PUT", body
        });

        if(response.status == 401 || response.status == 400) {
          this.toast.error("Senha atual digitada não coincide com a salva.");
          this.loader.endLoading();
          return;
        }

        if (response.status == 200) {
          this.toast.success("Senha alterada com sucesso.");
          this.$router.push("/perfil");
          this.loader.endLoading();
          return;
        }

        this.toast.error("Erro ao alterar senha.");
      } catch(err: any) {
        this.toast.error("Erro ao alterar senha.");
        console.error(err);
      }
      this.loader.endLoading();
    },
  }, 
});
</script>
