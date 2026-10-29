<template>
  <v-container>
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
          class="font-weight-bold ml-2">Esqueci minha senha</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main class="d-flex flex-column pa-0 mt-14 justify-center text-center align-center w-100">
      <v-container class="container">
        <p class="mb-4">Digite o e-mail associado à sua conta</p>
        <v-text-field 
          v-model="email"
          label="E-mail"
        />
        <div class="d-flex flex-row">
          <p class="mb-4 mr-2">Lembrou sua senha?</p>
          <NuxtLink href="/login" class="font-weight-bold mb-6 text-blue-dark"
            >Faça login</NuxtLink
          >
        </div>
        <v-btn @click="request">Enviar pedido de alteração</v-btn>
      </v-container>
    </v-main>
  </v-container>
</template>

<script lang="ts" setup>
import { useLoaderStore } from '~/stores/loader';
import { validateEmail } from '~/utils/validate';

const email = ref("");
const loader = useLoaderStore();
const router = useRouter();

async function request() { 
  const { $api, $toast } = useNuxtApp();
  
  if (!validateEmail(email.value)) {
    $toast.error("E-mail inválido.");
    loader.endLoading();
    return;
  }

  loader.startLoading();
  const response: any = await $api(
    "/usuarios/email/redefinir-senha",    
    {
      body: { email: email.value },
      method: "POST"
    }
  );

  if(response.status == 200) {
    $toast.success("Pedido enviado.");
    loader.endLoading();
    router.push("/login");
    return;
  }

  if(response.status == 401) {
    $toast.error("Não existe nenhuma conta cadastrada associada à este e-mail.");
    loader.endLoading();
    return;
  }

  if(response.status == 403) {
    $toast.error("Não foi possível alterar a senha. Tente ativar a conta.");
    loader.endLoading();
    return;
  }

  $toast.error("Erro ao requisitar nova senha.");
  loader.endLoading();
}
</script>
<style scoped>
a {
  color: inherit;
  text-decoration: none;
}

.content {
  min-width: 350px;
}
</style>