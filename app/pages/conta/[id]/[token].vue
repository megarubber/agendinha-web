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

async function request() {
    loader.startLoading();

    const { $api } = useNuxtApp();
    const response = await $api("/usuarios/confirmar", {
        method: "POST",
        body: { identifier: Number(route.params.id || '0') }
    });

    if(response.status == 403) {
        toast.error("Usuário já tem o cadastro confirmado.");
        loader.endLoading();
        return;        
    }

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