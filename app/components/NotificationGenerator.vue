<template>
  <v-card
    v-for="notification in allNotifications"
    :key="notification.id_notificacao"
    variant="flat"
    :color="realColor"
    rounded="xl"
    class="mb-3"
    @click="$emit('requestDetails', notification)"
  >
    <v-card-item>
      <template #append>
        <p class="text-blue-dark">{{ formatDate(notification.data) }}</p>
      </template>
      <p>{{ notification.titulo }}</p>
      <p>{{ notification.descricao }}</p>
    </v-card-item>
  </v-card>
</template>

<script lang="ts" setup>
import type Notification from "~~/shared/types/notification";

const props = defineProps({
  notifications: {
    type: Array as PropType<Notification[]>,
    required: true,
  },
  color: {
    type: String,
    required: true,
  }
});
defineEmits(['requestDetails']);

const allNotifications = ref([] as Notification[]);
allNotifications.value = props.notifications;

watch(
  () => props.notifications,
  (value, oldValue) => {
    if(value.length != oldValue.length)
      allNotifications.value = value;
  }
);

const realColor = ref('');
realColor.value = props.color;

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}
</script>
