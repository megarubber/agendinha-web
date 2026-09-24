<template>
  <v-container class="d-flex ga-2 flex-column pb-16">
    <div class="d-flex flex-column ga-2 pt-4">
      <p class="font-weight-bold text-h6 mb-1">Novo agendamento</p>
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
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useAppointments } from "~/composables/useAppointments";
import { useLoaderStore } from "~/stores/loader";
import { useAuthStore } from "~/stores/auth";

const loader = useLoaderStore();
const auth = useAuthStore();

loader.endLoading();

definePageMeta({
  middleware: "auth",
  requiresRole: "ROLE_ADMIN"
});

const { createAppointment } = useAppointments();

const { $toast, $api } = useNuxtApp();

const isSaving = ref(false);

const login = reactive({
  email: "",
  password: "",
});

const appointmentForm = reactive({
  userId: "",
  title: "",
  description: "",
  date: "",
  location: "",
  doctor: "",
});

function logout() {
  auth.logout();
}

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

    if (response.status === 200) {
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