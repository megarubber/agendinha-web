<template>
  <v-container class="pa-2 h-100 position-fixed">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-nav-icon
        @click="updateUserNotificationStatus">
          <NuxtLink
            href="/perfil">
            <v-icon 
            style="background-color: #D7F2FF;"
            class="pa-4 rounded-xl"
            color="blue-dark"
            icon="mdi-chevron-left"/>
          </NuxtLink>
        </v-app-bar-nav-icon>
        <v-app-bar-title
          class="font-weight-bold ml-2">Notificações</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main>
      <v-row class="d-flex pa-4 justify-space-between">
        <p class="mt-4">Receber Notificações</p>
        <v-switch v-model="notifications" inset />
      </v-row>
      <v-container v-if="notifications" class="notification-card">
        <v-row class="d-flex justify-space-between mb-2">
          <p class="mt-2">Consultas e/ou Exames</p>
          <v-switch 
            v-model="appointments" 
            class="ma-0 pa-0" 
            inset 
            density="compact"
            hide-details
            />
        </v-row>
        <v-row class="d-flex justify-space-between">
          <p class="mt-2">Informações sobre a APARTE</p>
          <v-switch 
            v-model="aparte" 
            class="ma-0 pa-0" 
            inset 
            density="compact"
            hide-details
            />
        </v-row>
      </v-container>
    </v-main>
  </v-container>
</template>

<script lang="ts">
export default defineComponent({
  name: "SettingsNotifications",
  setup() {
    definePageMeta({ middleware: "auth" });
  },
  data() {
    return {
      notifications: ref(false),
      appointments: ref(false),
      aparte: ref(false),
    };
  },
  async mounted() {
    const appointments = Boolean(useCookie("appointments").value);
    const aparte = Boolean(useCookie("aparte").value);

    this.notifications = appointments || aparte;
    this.appointments = appointments;
    this.aparte = aparte;

    await Notification.requestPermission();
  },
  methods: {
    updateUserNotificationStatus() {
      const appointments = useCookie("appointments");
      appointments.value = this.appointments ? "1" : null;

      const aparte = useCookie("aparte");
      aparte.value = this.aparte ? "1" : null;
    }
  }
});
</script>

<style scoped>
.notification-card {
  background-color: #ECEDF4;
  border-radius: 15px;
  padding: 25px;
}
</style>
