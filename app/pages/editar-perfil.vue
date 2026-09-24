<template>
  <v-container class="position-fixed h-100">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-nav-icon>
          <NuxtLink
            href="/perfil">
            <v-icon 
            style="background-color: #D7F2FF;"
            class="pa-4 rounded-xl"
            color="blue-dark"
            icon="mdi-chevron-left"/>
          </NuxtLink>
        </v-app-bar-nav-icon>
        <v-app-bar-title
          class="font-weight-bold ml-2">Alterar dados</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main>
      <p class="text-h6 mb-2">Dados pessoais</p>
      <v-text-field
        v-model="user.nome"
        prepend-inner-icon="mdi-account-outline"
        label="Nome do(a) responsável"
        />
      <p class="text-h6 mb-2">Dados de acesso</p>
      <v-text-field 
        v-model="user.email" 
        prepend-inner-icon="mdi-email-outline"
        label="E-mail"
        />
      <v-btn 
        class="w-100 mb-5"
        @click="update"
        >Atualizar</v-btn>
      <v-btn
        class="w-100"
        color="#F8F8F8"
        text="Alterar senha"
        prepend-icon="mdi-pencil-outline"
        to="/alterar-senha"
      />
    </v-main>
  </v-container>
</template>

<script lang="ts">
import type UserUpdate from "~~/shared/types/userUpdate";
import { useAuthStore } from "~/stores/auth";
import { useLoaderStore } from "~/stores/loader";

export default defineComponent({
  name: "UpdateProfile",
  setup() {
    definePageMeta({ middleware: "auth", requiresRole: "ROLE_USER" });
  },
  data() {
    return {
      user: {
        nome: "",
        email: "",
      },
      auth: storeToRefs(useAuthStore()),
      loader: useLoaderStore(),
      toast: useNuxtApp().$toast as any,
    };
  },
  mounted() {
    this.user.nome = this.auth.user.nome;
    this.user.email = this.auth.user.email;
  },
  methods: {
    async update() {
      const testName = /^[A-Za-z](?:[A-Za-z ]*[A-Za-z])$/;
      if (!testName.test(this.user.nome)) {
        this.toast.error("Nome inválido.");
        return;
      }

      this.loader.startLoading();

      const userUpdate: UserUpdate = {
        nome: this.user.nome,
        email: this.user.email,
      };

      try {
        const { $api } = useNuxtApp();
        const token = useCookie("token");
        const response: any = await $api("/usuarios/update", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
          body: userUpdate
        });
        
        if(response.status == 200 || response.status == 201) {
          this.toast.success("Alteração feita com sucesso.");
          this.$router.push("/perfil");
        }
      } catch(error) {
        this.toast.success("Erro ao editar dados.");
        throw error;
      }
      
      this.loader.endLoading();
    },
  }, 
});
</script>
