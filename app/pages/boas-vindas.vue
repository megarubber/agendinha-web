<template>
  <v-container class="d-flex flex-column align-center justify-center text-center h-100">
    <v-app-bar elevation="0" color="transparent">
      <template #prepend>
        <v-app-bar-nav-icon>
          <img src="/images/agendinha_logo.png" alt="Logo Agendinha" class="logo">
        </v-app-bar-nav-icon>
      </template>
    </v-app-bar>
    <div class="content d-flex flex-column align-center ga-4 w-100">
      <h2 class="font-weight-bold">Bem-vindo(a) à Agendinha</h2>
      <p>Organize seus compromissos e acompanhe tudo de forma simples.</p>
      <v-btn
        to="/login"
        color="primary"
        :block="xs"
        :size="mdAndUp ? 'x-large' : 'large'"
        class="mt-2"
        @click="activateFirstTime"
      >
        Começar agora
      </v-btn>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { useDisplay } from "vuetify";

const { xs, mdAndUp } = useDisplay();

const firstTime = useCookie("firsttime");
function activateFirstTime(): void {
  firstTime.value ||= "false";
}
</script>

<style scoped>
.content {
  max-width: 480px;
}

.logo {
  width: 100px;
  margin-left: 70px;
}

@media (min-width: 960px) {
  .content {
    max-width: 640px;
  }
}
</style>