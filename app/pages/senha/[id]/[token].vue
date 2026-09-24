<template>
  <v-container>
    <v-app-bar>
      <template #prepend>
        <v-app-bar-title
          class="font-weight-bold ml-2">Alterar senha</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main>
      <v-text-field
        v-model="password" 
        label="Nova Senha"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showPassword = !showPassword"
        />
      <v-text-field
        v-model="confirmPassword" 
        label="Confirmar Senha"
        :type="showConfirmPassword ? 'text' : 'password'"
        :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showConfirmPassword = !showConfirmPassword"
        />
      <v-btn 
        class="w-100"
        @click="updatePassword"
        >Alterar Senha</v-btn>
    </v-main>
  </v-container>
</template>

<script lang="ts" setup>
import type UserNewPasswordWithoutLogin from '~~/shared/types/userNewPasswordWithoutLogin';
import { useLoaderStore } from '~/stores/loader';
const route = useRoute();
const loader = useLoaderStore();
const router = useRouter();

const password = ref("");
const showPassword = ref(false);
const confirmPassword = ref("");
const showConfirmPassword = ref(false);

async function updatePassword() {
  const { $api, $toast } = useNuxtApp();
  loader.startLoading();

  if(password.value != confirmPassword.value) {
    $toast.error("Senhas não são iguais.");
    loader.endLoading();
    return;
  }

  const body: UserNewPasswordWithoutLogin = {
    id: Number(route.params.id || '0'),
    senha_nova: password.value
  }

  const response: any = await $api("/usuarios/redefinir-senha", {
    method: "PUT", body
  });

  if(response.status == 401) {
    $toast.error("Usuário não existe.");
    loader.endLoading();
    return;
  }

  if(response.status != 200) {
    $toast.error("Erro ao alterar senha.");
    loader.endLoading();
    return;
  }

  $toast.success("Senha alterada com sucesso!");
  router.push("/login");
  loader.endLoading();
}
</script>
