<template>
  <v-container class="h-100 position-fixed">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-title
          class="font-weight-bold ml-2">
          Novo agendamento
        </v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main>
      <v-text-field
        v-model="appointmentForm.userId"
        prepend-inner-icon="mdi-identifier"
        label="ID do paciente"
        type="number"
      />
      <v-text-field
        v-model="appointmentForm.title"
        prepend-inner-icon="mdi-text-short"
        label="Título"
      />
      <v-text-field
        v-model="appointmentForm.description"
        prepend-inner-icon="mdi-text"
        label="Descrição"
      />
      <v-text-field
        v-model="appointmentForm.date"
        prepend-inner-icon="mdi-calendar-clock-outline"
        label="Data e hora"
        type="datetime-local"
      />
      <v-text-field
        v-model="appointmentForm.location"
        prepend-inner-icon="mdi-map-marker-outline"
        label="Local"
      />
      <v-text-field
        v-model="appointmentForm.doctor"
        prepend-inner-icon="mdi-stethoscope"
        label="Médico responsável"
      />
      <v-btn
        class="w-100"
        :loading="isSaving"
        @click="saveAppointment"
      >
        Confirmar agendamento
      </v-btn>
    </v-main>
  </v-container>
</template>

<script setup lang="ts">
import { useAppointments } from "~/composables/useAppointments";
import { useLoaderStore } from "~/stores/loader";

const loader = useLoaderStore();

loader.endLoading();

definePageMeta({
  requiresRole: "ROLE_ADMIN",
  showHeader: true
});

const { createAppointment } = useAppointments();

const { $toast } = useNuxtApp();

const isSaving = ref(false);

const appointmentForm = reactive({
  userId: "",
  title: "",
  description: "",
  date: "",
  location: "",
  doctor: "",
});

async function saveAppointment() {
  if (
    !appointmentForm.userId ||
    !appointmentForm.title ||
    !appointmentForm.date
  ) {
    $toast?.error("Preencha ID do paciente, título e data.");
    return;
  }

  isSaving.value = true;

  try {
    const date = new Date(appointmentForm.date);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    const response: any = await createAppointment({
        titulo: appointmentForm.title.toUpperCase(),
        descricao: appointmentForm.description.toUpperCase(),
        data: `${day}/${month}/${year} ${hour}:${minute}`,
        local: appointmentForm.location.toUpperCase(),
        medico: appointmentForm.doctor.toUpperCase(),
        id_usuario: Number(appointmentForm.userId),
    });

    if (response.status == 200) {
      $toast?.success("Agendamento criado com sucesso!");

      appointmentForm.userId = "";
      appointmentForm.title = "";
      appointmentForm.description = "";
      appointmentForm.date = "";
      appointmentForm.location = "";
      appointmentForm.doctor = "";
    } else {
      $toast?.error("Erro ao criar agendamento.");
    }
  } catch {
    $toast?.error("Erro ao criar agendamento.");
  } finally {
    isSaving.value = false;
  }
}
</script>