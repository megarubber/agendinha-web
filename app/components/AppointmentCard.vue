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
import type ShowAppointment from "~~/shared/types/showAppointment";
import { useAuthStore } from "~/stores/auth";
import { useLoaderStore } from "~/stores/loader";
import convertToISODate from "~/utils/convertToISODate";

const { $toast } = useNuxtApp();
const props = defineProps<ShowAppointment>();
const auth = useAuthStore();
const { accessToken } = storeToRefs(auth);
const loader = useLoaderStore();
const emit = defineEmits(['close']);

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
    description: `${props.descricao}, Médico: ${props.medico}`,
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
