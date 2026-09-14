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
            <v-card-title class="font-weight-bold text-wrap">
                {{ props.nome_paciente || 'Paciente' }}
            </v-card-title>
            <v-card-subtitle class="text-h6 pb-2">
                {{ props.titulo }}
            </v-card-subtitle>
            <v-card-text style="white-space: pre-wrap;">
                {{ props.descricao }}
            </v-card-text>
            <section>
                <v-card-text>
                    Médico: {{ props.medico }}
                </v-card-text>
                <v-card-text>
                    Local: {{ props.local }}
                </v-card-text>
            </section>
            <v-divider :thickness="3"/>
            <v-card-actions v-if="props.modo_google">
                <v-btn 
                    variant="flat" 
                    class="w-100 ml-2 font-weight-bold"
                    @click="moveToGoogleCalendar"
                >
                    Adicionar ao Google Calendário
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-bottom-sheet>
</template>
<script lang="ts" setup>
import type ShowExam from "~~/shared/types/showExam";
import type Exam from "~~/shared/types/exam";
import { useAuthStore } from "~/stores/auth";
import { useLoaderStore } from "~/stores/loader";
import type GoogleTokens from "~~/shared/types/googleTokens";

const toast: any = useNuxtApp().$toast;
const props = defineProps<ShowExam>();
const auth = useAuthStore();
const loader = useLoaderStore();
const googleCalendar = useGoogleCalendar();
const emit = defineEmits(['close']);

const status = ref(false);
status.value = props.show;

async function moveToGoogleCalendar() {
    loader.startLoading();
    emit("close");
    const response: any = await googleCalendar.createTaskIntoCalendar({
        id_agendamento: props.id_agendamento,
        id_paciente: props.id_paciente,
        titulo: props.titulo,
        descricao: props.descricao,
        data: props.data,
        medico: props.medico,
        local: props.local,
        lembrete_enviado: props.lembrete_enviado
    } as Exam);

    if(response.status == 200) {
        toast.success("Agendamento criado.");
        const newTokens: any = response.data.tokens;
        if('access_token' in newTokens) {
            auth.googleTokens = {
                access_token: newTokens.access_token as string,
                id_token: newTokens.id_token as string,
                refresh_token: newTokens.refresh_token as string
            } as GoogleTokens;
        }
        loader.endLoading();
        return;
    }

    toast.error("Erro ao criar agendamento.");
    loader.endLoading();
}
</script>
