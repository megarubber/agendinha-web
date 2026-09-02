<template>
  <div
    v-for="exam in exams"
    :key="exam.id_agendamento"
    class="d-flex justify-space-between align-center w-100"
  >
    <section class="text-center text-h6 text-blue-dark font-weight-bold">
      <p>{{ formatDate(convertToISODate(exam.data)).day }}</p>
      <p>{{ formatDate(convertToISODate(exam.data)).month }}</p>
    </section>
    <v-card
      variant="flat"
      color="#E6F6FE"
      rounded="xl"
      class="card mb-2"
      :subtitle="formatDate(convertToISODate(exam.data)).weekday + ' - ' + exam.titulo"
      :text="exam.local"
    >
      <template #title>
        <span class="font-weight-bold text-wrap">
          {{ exam.nome_paciente || 'Paciente Desconhecido' }}
        </span>
      </template>
      <template #append>
        <v-icon
        class="mt-6" color="blue-dark" size="35" 
        icon="mdi-chevron-right" @click="$emit('requestDetails', exam)"/>
      </template>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type Exam from "~/interfaces/exam";
import convertToISODate from "~/server/utils/others/convertToISODate";

defineProps({
  exams: {
    type: Array as PropType<Exam[]>,
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
  const formattedTime = date
    .toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", "h");

  return {
    weekday: `${weekdays[date.getDay()]} às ${formattedTime}`,
    day: formattedDate[0] + formattedDate[1],
    month: months[date.getMonth()],
  };
}
</script>

<style scoped>
.card {
  width: 85%;
}
</style>
