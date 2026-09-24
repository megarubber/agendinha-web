<template>
  <v-container class="pa-0 h-100 position-fixed">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-title
          class="font-weight-bold ml-2">
          Notificações
        </v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main class="d-flex flex-column ga-4 mx-3 mt-3">
      <section v-if="readNotifications.length > 0 || notReadNotifications.length > 0">
        <section v-if="notReadNotifications.length > 0">
          <section class="scroll">
            <p class="mb-4">Não Lidas</p>
            <NotificationGenerator 
            :notifications="notReadNotifications" 
            color="blue-light" 
            @request-details="(notification: Notification) => requestDetails(notification)"
            />
          </section>
        </section> 
        <section v-if="readNotifications.length > 0">
          <section class="scroll">
            <p>Lidas</p>
            <NotificationGenerator 
            :notifications="readNotifications" 
            color="#F8F8F8" 
            @request-details="(notification: Notification) => requestDetails(notification)"
            />
          </section>
        </section>
      </section>
      <section v-else>
        <p class="text-center">Sem notificações encontradas</p>
      </section>
    </v-main>
    <div v-if="showNotificationDetails">
      <notification-card
        :id="selectedNotification.id_notificacao"
        :title="selectedNotification.titulo"
        :description="selectedNotification.descricao"
        :show="showNotificationDetails"
        :read="selectedNotification.lida"
        @close="showNotificationDetails = !showNotificationDetails"
        @read="read"
        @delete="deleteNotificationFromList"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import type Notification from "~~/shared/types/notification";
import { useLoaderStore } from "~/stores/loader";
import { useAuthStore } from "~/stores/auth";

export default defineComponent({
  name: "Notifications",
  setup() {
    definePageMeta({ middleware: "auth", showHeader: true });
  },
  data() {
    return {
      readNotifications: ref([] as Notification[]),
      notReadNotifications: ref([] as Notification[]),
      loader: useLoaderStore(),
      auth: storeToRefs(useAuthStore()),
      showNotificationDetails: ref(false),
      selectedNotification: ref({} as Notification)
    };
  },
  async mounted() {
    await this.updateNotifications();
  },
  methods: {
    read() {
      if(this.selectedNotification.lida) return;

      const notifications = this.notReadNotifications.filter(
        (notification) => notification.id_notificacao !== this.selectedNotification.id_notificacao
      );

      this.notReadNotifications = notifications;
      
      this.selectedNotification.lida = true;
      this.readNotifications.push(this.selectedNotification);

      this.auth.notReadNotifications = this.notReadNotifications.length;
    },
    requestDetails(notification: Notification) {
      this.selectedNotification = notification;
      this.showNotificationDetails = !this.showNotificationDetails;
    },
    async updateNotifications() {
      this.loader.startLoading();
      const { $api } = useNuxtApp();
      const token = useCookie("token");

      const response = await $api(`/notificacoes/usuario/${this.auth.user.id_usuario}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      const notifications: Notification[] = response.data ?? [];

      if(notifications.length > 0) {
        this.readNotifications = notifications.filter(
          (notification) => notification.lida
        );
        this.notReadNotifications = notifications.filter(
          (notification) => !notification.lida
        );
      }

      this.auth.notReadNotifications = this.notReadNotifications.length;
      this.loader.endLoading();
    },
    deleteNotificationFromList() {
      if(this.selectedNotification.lida) {
        const notifications = this.readNotifications.filter(
          notification => notification.id_notificacao !== this.selectedNotification.id_notificacao
        );
        this.readNotifications = notifications;
        return;
      }
      
      const notifications = this.notReadNotifications.filter(
        notification => notification.id_notificacao !== this.selectedNotification.id_notificacao
      );
      this.notReadNotifications = notifications;

      this.auth.notReadNotifications = this.notReadNotifications.length;
    }
  }
});
</script>

<style scoped>
hr {
  height: 3px;
  background-color: #e8e9ed;
  border: none;
}

.scroll {
  overflow-y: scroll;
  height: 400px;
}
</style>
