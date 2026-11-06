<template>
  <div
    v-for="user in users"
    :key="user.id_usuario"
    class="d-flex justify-space-between align-center w-100"
  >
    <v-card
      variant="flat"
      color="#E6F6FE"
      rounded="xl"
      class="card w-100 mt-4"
      :subtitle="`${user.email}`"
    >
      <v-card-item>
        <span class="text-label-medium">{{ formatCPF(user.cpf!) }}</span>
      </v-card-item>
      <template #title>
        <span class="font-weight-bold text-wrap">
          {{ user.nome }}
        </span>
      </template>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { type User } from "~~/shared/types/user";
import formatCPF from "~/utils/formatCPF";

defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
  }
});
</script>