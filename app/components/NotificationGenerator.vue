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
import type Notification from "~/interfaces/notification";

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

function formatDate(eventDate: string) {
  return eventDate.substring(0, 5);
}
</script>
