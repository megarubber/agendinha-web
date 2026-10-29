<template>
    <v-container class="h-100">
        <v-app-bar>
        <template #prepend>
            <v-app-bar-title
            class="font-weight-bold ml-2">Confirmar cadastro</v-app-bar-title>
        </template>
        </v-app-bar>
        <v-main class="d-flex flex-column ga-2 w-100 align-center">
            <v-content class="content">
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
                    >Alterar Senha e Confirmar Cadastro</v-btn>
            </v-content>
        </v-main>
    </v-container>
</template>

<script lang="ts" setup>
import { useLoaderStore } from "~/stores/loader";
import type UserNewPasswordWithoutLogin from '~~/shared/types/userNewPasswordWithoutLogin';

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

  const response: any = await $api("/usuarios/confirmar-redefinir-senha", {
    method: "PUT", body
  });

  if(response.status == 403) {
    $toast.error("Usuário já tem o cadastro confirmado.");
    loader.endLoading();
    return;        
  }

  if(response.status == 401) {
    $toast.error("Usuário não existe.");
    loader.endLoading();
    return;
  }

  if(response.status != 200) {
    $toast.error("Erro ao alterar senha ou confirmar e-mail.");
    loader.endLoading();
    return;
  }

  $toast.success("E-mail confirmado com sucesso!");
  router.push("/login");
  loader.endLoading();
}
</script>

<style scoped>
.content {
  min-width: 350px;
}
</style>