<template>
    <v-container class="h-100">
        <v-main class="d-flex flex-column h-100 justify-center align-center">
            <p class="mb-4 text-center">Clique no botão para confirmar cadastro.</p>
            <v-btn 
                class="w-100"
                @click="request"
                >Confirmar cadastro</v-btn>
        </v-main>
    </v-container>
</template>

<script lang="ts" setup>
import { useLoaderStore } from "~/stores/loader";

const route = useRoute();
const loader = useLoaderStore();
const toast: any = useNuxtApp().$toast;
const router = useRouter();

async function confirmAccount(data: string | number) {
  const { $api } = useNuxtApp();
  
  let body: any = {};

  if(isNumber(data)) body = { id_usuario: data };
  else body = { email: data };

  const response = await $api("/usuarios/confirmar", {
    method: "POST",
    body
  });

  return response;
}

async function request() {
    loader.startLoading();
    const response = await confirmAccount(
        Number(route.params.id || '0')
    );

    if(response.status != 200) {
        toast.error("Erro ao confirmar e-mail.");
        loader.endLoading();
        return;
    }

    toast.success("E-mail confirmado com sucesso!");
    router.push("/login");
    loader.endLoading();
}
</script>