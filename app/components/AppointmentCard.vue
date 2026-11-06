<template>
    <v-bottom-sheet
        v-model="status"
        height="75%"
        content-class="generic-card"
    >
        <v-card class="rounded-t-xl rounded-b-0">
            <template #append>
                <div class="d-flex ga-2 align-center mt-2 mr-2">
                    <template v-if="props.modo_admin">
                        <v-btn
                            color="error"
                            variant="tonal"
                            icon="mdi-delete"
                            size="small"
                            @click="$emit('delete', props.id_agendamento)"
                        />
                        <v-btn
                            color="primary"
                            variant="tonal"
                            icon="mdi-pencil"
                            size="small"
                            @click="$emit('edit', props.id_agendamento)"
                        />
                    </template>
                    <v-avatar
                        color="#BCD4FF" 
                        size="35" class="cursor-pointer ml-1" @click="$emit('close');">
                        <v-icon 
                            color="#0C3784"
                            class="pa-2"
                            size="30"
                        >mdi-close</v-icon>
                    </v-avatar>
                </div>
            </template>
            <v-divider :thickness="3"/>
            <v-card-title class="font-weight-bold text-wrap">
                {{ props.modo_admin ? (props.nome_paciente || 'Paciente') : props.titulo }}
            </v-card-title>
            <v-card-subtitle v-if="props.modo_admin" class="text-h6 pb-2">
                {{ props.titulo }}
            </v-card-subtitle>
            <v-card-text style="white-space: pre-wrap;">
                {{ props.descricao }}
            </v-card-text>
            <section>
                <v-card-text class="pt-0 pb-1">
                    <strong>Data/Horário:</strong> {{ props.data }}
                </v-card-text>
                <v-card-text class="py-1">
                    <strong>Responsável:</strong> {{ props.medico }}
                </v-card-text>
                <v-card-text class="pt-1">
                    <strong>Local:</strong> {{ props.local }}
                </v-card-text>
            </section>
            <v-divider :thickness="3"/>
            <v-card-actions v-if="props.modo_google" class="pa-4 mt-4 pt-0 mb-2">
                <v-btn 
                    color="primary"
                    variant="flat" 
                    class="w-100 font-weight-bold text-body-1 rounded-lg"
                    height="48"
                    prepend-icon="mdi-google"
                    @click="moveToGoogleCalendar"
                >
                    Adicionar ao Google Agenda
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-bottom-sheet>
</template>
<script lang="ts" setup>
import type ShowAppointment from "~~/shared/types/showAppointment";
import { useAuthStore } from "~/stores/auth";
import { useLoaderStore } from "~/stores/loader";
import convertToISODate from "~/utils/convertToISODate";

const { $toast } = useNuxtApp();
const props = defineProps<ShowAppointment>();
const auth = useAuthStore();
const { accessToken } = storeToRefs(auth);
const loader = useLoaderStore();
const emit = defineEmits(['close', 'edit', 'delete']);

const status = ref(false);
status.value = props.show;

async function moveToGoogleCalendar() {
  loader.startLoading();
  emit("close");
  const start = convertToISODate(props.data);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const event = {
    summary: props.titulo,
    location: props.local,
    description: `${props.descricao}, Responsável: ${props.medico}`,
    start: { dateTime: start.toISOString(), timeZone: 'America/Sao_Paulo' },
    end: { dateTime: end.toISOString(), timeZone: 'America/Sao_Paulo' },
    colorId: '6',
  };

  const response: any = await $fetch.raw(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (response.status === 401) {
    $toast.error("Erro ao exportar agendamento.");
    loader.endLoading();
    throw new Error('TOKEN_EXPIRED');
  }
  if (!response.ok) {
    $toast.error("Erro ao exportar agendamento.");
    loader.endLoading();
    throw new Error(`Calendar API error: ${response.status}`);
  }

  $toast.success("Agendamento criado.");
  loader.endLoading();
}
</script>