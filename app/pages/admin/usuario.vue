<template>
  <v-container class="h-100 position-fixed">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-title
          class="font-weight-bold ml-2">Gerenciar usuários</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main>
      <v-tabs v-model="tab">
        <v-tab class="w-50" color="black" value="list">
          <p class="font-weight-bold">Lista</p>
        </v-tab>
        <v-tab class="w-50" color="black" value="create">
          <p class="font-weight-bold">Cadastrar</p>
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab" class="px-3">
        <v-tabs-window-item value="list">
          <div v-if="loader.isLoading" class="d-flex justify-center py-6">
            Carregando...
          </div>
          <p v-else-if="!users.length" class="text-center text-medium-emphasis py-6">
            Nenhum usuário encontrado.
          </p>
          <UserCardGenerator v-else :users="users" />
        </v-tabs-window-item>
        <v-tabs-window-item value="create">
          <v-mask-input
            v-model="user.cpf"
            prepend-inner-icon="mdi-badge-account-horizontal-outline"
            class="mt-4"
            label="CPF"
            mask="###.###.###-##"
          />
          <v-text-field 
            v-model="user.email" 
            prepend-inner-icon="mdi-email-outline"
            label="E-mail"
            />
          <v-text-field 
            v-model="user.nome" 
            prepend-inner-icon="mdi-account-outline"
            label="Nome"
            />
          <v-text-field
            v-model="user.senha"
            prepend-inner-icon="mdi-form-textbox-password"
            label="Senha"
            :type="show ? 'text' : 'password'"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show = !show"
          />
          <v-btn class="w-100" @click="register()">Criar conta</v-btn>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-main>
  </v-container>
</template>

<script lang="ts">
import { useLoaderStore } from "~/stores/loader";
import type UserRegister from "~~/shared/types/userRegister";
import { type User } from "~~/shared/types/user";
import type UserListResponse from "~~/shared/types/userListResponse";
import { useAuthStore } from "~/stores/auth";

export default defineComponent({
  setup() {
    definePageMeta({ 
      showHeader: true,
      requiresRole: "ROLE_ADMIN"
    });
  },
  data() {
    return {
      user: ref({
        email: "",
        nome: "",
        senha: "",
        cpf: "",
      } as UserRegister),
      users: ref([] as User[]),
      show: false,
      loader: useLoaderStore(),
      auth: useAuthStore(),
      tab: ref(null),
    };
  },
  async mounted() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      const { $toast, $api } = useNuxtApp();
      const token = useCookie("token");
      this.loader.startLoading();
      try {
        const response = await $api("/admin/usuarios", {
          headers: {
            Authorization: `Bearer ${token.value}`, // adjust to how you store the JWT
          },
          query: { page_size: 100 },
        });

        this.users = response.data.results;
      } catch (e) {
        $toast.error("Não foi possível carregar os usuários.");
      } finally {
        this.loader.endLoading();
      }
    },
    async register() {
      this.loader.startLoading();
      const { $toast, $api } = useNuxtApp();

      const testEmail =
        /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      
      if (!testEmail.test(this.user.email)) {
        $toast.error("E-mail inválido.");
        this.loader.endLoading();
        return;
      }

      if(this.user.cpf.length != 11) {
        $toast.error("CPF inválido.");
        this.loader.endLoading();
        return;
      }

      if (this.user.senha.length <= 0) {
        $toast.error("Senha inválida.");
        this.loader.endLoading();
        return;
      }
      this.user.cpf = this.user.cpf.replace(/[^0-9]/g, ''); 
      const token = useCookie("token");
      const response: any = await $api(
        "/admin/usuarios/registrar",
        {
          method: "POST",
          body: this.user,
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      if(response.status == 200) {
        $toast.success("E-mail de cadastro enviado.");
        this.user.email = '';
        this.user.nome = '';
        this.user.senha = '';
        this.user.cpf = '';
      }
      else $toast.error("Erro ao fazer o cadastro.");

      this.loader.endLoading();
    },
  },
});
</script>
