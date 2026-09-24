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
                {{ props.title }}
            </v-card-title>
            <v-card-text>
                {{ props.description }}
            </v-card-text>
            <v-divider :thickness="3"/>
            <v-card-actions>
                <v-btn 
                    color="#FFAFAF"
                    variant="flat"
                    @click="deleteOpenedNotification"
                >
                    <v-icon 
                        color="#990000"
                        icon="mdi-trash-can-outline"
                    />
                </v-btn>
                <v-btn 
                    v-if="!props.read"
                    variant="flat" 
                    class="w-66 ml-2 font-weight-bold"
                    @click="markAsRead"
                >
                    Marcar como lida
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-bottom-sheet>
</template>
<script lang="ts" setup>
import type ShowNotification from "~~/shared/types/showNotification";
import { useLoaderStore } from "~/stores/loader";

const props = defineProps<ShowNotification>();
const { $toast, $api } = useNuxtApp();
const loader = useLoaderStore();

const status = ref(false);
status.value = props.show;
const emit = defineEmits(['close', 'read', 'delete']);

async function markAsRead() {
    loader.startLoading();
    const token = useCookie("token");
    const response: any = await $api(`/notificacoes/${props.id}/lida`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
    });

    if(response.status != 200) {
        $toast.error("Erro ao marcar notificação como lida.");
        loader.endLoading();
        return;
    }

    loader.endLoading();
    emit('read');
    emit('close');
}

async function deleteOpenedNotification() {
    loader.startLoading();
    const token = useCookie("token");
    const response: any = await $api(`/notificacoes/id/${props.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token.value}` },
    });

    if(response.status != 200) {
        $toast.error("Erro ao deletar notificação.");
        loader.endLoading();
        return;
    }

    loader.endLoading();
    emit('delete');
    emit('close');
}
</script>