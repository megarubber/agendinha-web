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
import type ShowNotification from "~/interfaces/showNotification";
import markNotificationAsRead from "~/server/api/notifications/markNotificationAsRead";
import { useLoaderStore } from "~/app/store/loader";
import deleteNotification from "~/server/api/notifications/deleteNotification";

const props = defineProps<ShowNotification>();
const toast: any = useNuxtApp().$toast;
const loader = useLoaderStore();

const status = ref(false);
status.value = props.show;
const emit = defineEmits(['close', 'read', 'delete']);

async function markAsRead() {
    loader.startLoading();
    const response = await markNotificationAsRead(props.id);

    if(response.status != 200) {
        toast.error("Erro ao marcar notificação como lida.");
        loader.endLoading();
        return;
    }

    loader.endLoading();
    emit('read');
    emit('close');
}

async function deleteOpenedNotification() {
    loader.startLoading();
    const response = await deleteNotification(props.id);

    if(response.status != 200) {
        toast.error("Erro ao deletar notificação.");
        loader.endLoading();
        return;
    }

    loader.endLoading();
    emit('delete');
    emit('close');
}
</script>