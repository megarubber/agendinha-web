<template>
  <v-container class="h-100 position-fixed">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-title
          class="font-weight-bold ml-2">
          Menu
        </v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main class="text-center d-flex h-100 justify-space-between flex-column">
        <client-only>
          <h3 style="color: #4b4b4b">Bem-vindo(a) de volta, {{ auth.user.nome }}</h3>
        </client-only>
      <section class="d-flex flex-column ga-10">
        <v-btn
          class="w-100"
          color="#F8F8F8"
          text="Desconectar"
          prepend-icon="mdi-exit-to-app"
          to="/login"
          @click="logUserOut"
        />
        <p class="text-primary mb-14 cursor-pointer" @click="requestDelete">
          Excluir Conta
        </p>
      </section>
    </v-main>
    <div v-if="showDelete">
      <delete-account 
        :show="showDelete"
        :user-id="user.id_usuario"
        @close="requestDelete"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const showDelete = ref(false);

definePageMeta({ 
  showHeader: true,
  requiresRole: "ROLE_ADMIN"
});

function logUserOut(): void {
  auth.logout();
}

function requestDelete(): void {
  showDelete.value = !showDelete.value;
}
</script>