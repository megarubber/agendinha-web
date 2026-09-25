<template>
  <div
    v-for="appointment in appointments"
    :key="appointment.id_agendamento"
    class="d-flex justify-space-between align-center w-100"
  >
    <section class="text-center text-h6 text-blue-dark font-weight-bold">
      <p>{{ formatDate(convertToISODate(appointment.data)).day }}</p>
      <p>{{ formatDate(convertToISODate(appointment.data)).month }}</p>
    </section>
    <v-card
      variant="flat"
      color="#E6F6FE"
      rounded="xl"
      class="card mb-2"
      :subtitle="formatDate(convertToISODate(appointment.data)).weekday + ' - ' + appointment.titulo"
      :text="appointment.local"
    >
      <template #title>
        <span class="font-weight-bold text-wrap">
          {{ appointment.nome_paciente || 'Paciente Desconhecido' }}
        </span>
      </template>
      <template #append>
        <v-icon
        class="mt-6" color="blue-dark" size="35" 
        icon="mdi-chevron-right" @click="$emit('requestDetails', appointment)"/>
      </template>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type Appointment from "~~/shared/types/appointment";
import convertToISODate from "~/utils/convertToISODate";

defineProps({
  appointments: {
    type: Array as PropType<Appointment[]>,
    required: true,
  }
});

defineEmits(['requestDetails']);

function formatDate(date: Date): any {
  const weekdays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta",
    "Sábado",
  ];
  const months = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];

  const formattedDate = date.toLocaleDateString("pt-BR");
  const formattedTime = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "h");

  return {
    weekday: `${weekdays[date.getDay()]} às ${formattedTime}`,
    day: `${formattedDate[0]}${formattedDate[1]}`,
    month: months[date.getMonth()],
  };
}
</script>

<style scoped>
.card {
  width: 85%;
}
</style>
