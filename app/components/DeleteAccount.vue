<template>
    <v-bottom-sheet
        v-model="status"
        height="75%"
    >
        <v-card class="rounded-xl">
            <template #append>
                <v-avatar
                color="#BCD4FF"
                size="35" class="cursor-pointer" @click="$emit('close');">
                    <v-icon 
                        color="#0C3784"
                        class="pa-2"
                        size="30"
                    >mdi-close</v-icon>
                </v-avatar>
            </template>
            <v-divider :thickness="3"/>
            <v-card-title class="font-weight-bold">
                Deletar Conta
            </v-card-title>
            <v-card-text class="text-center">
                <v-icon size="100" class="mb-5">mdi-account-remove</v-icon>
                <p>
                    Tem certeza que deseja deletar a conta? 
                    Seus dados não poderão ser recuperados.
                </p>
            </v-card-text>
            <v-divider :thickness="3"/>
            <v-card-actions>
                <v-btn 
                    variant="flat"
                    color="#FFAFAF"
                    class="w-33"
                    @click="$emit('close');"
                >
                    Não
                </v-btn>
                <v-btn 
                    variant="flat" 
                    class="w-66 font-weight-bold"
                    @click="requestDelete"
                >
                    Sim
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-bottom-sheet>
</template>
<script lang="ts" setup>
import { useAuthStore } from "~/stores/auth";

const { $api, $toast } = useNuxtApp();
const auth = useAuthStore();
const router = useRouter();
const status = ref(false)

defineEmits(['close']);

const props = defineProps({ 
    show: Boolean, 
    userId: {
        type: Number,
        required: true
    },
});

status.value = props.show;

async function requestDelete(): Promise<void> {
    const token = useCookie("token");

    const response: any = await $api("/usuarios/delete", {
        method: "DELETE",
        headers: {
        Authorization: `Bearer ${token.value}`,
        },
        body: { id_usuario: props.userId }
    });

    if(response.status != 200) {
        $toast.error("Erro ao deletar conta.")
        return;
    }

    auth.logout();
    router.push("/login");
}
</script>