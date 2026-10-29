<template>
  <v-container class="fix-header pa-0 position-fixed bottom-0 bg-white d-flex justify-center">
    <v-tabs v-if="auth.user.role == 'ROLE_ADMIN'" v-model="currentTab" @click="changePage">
      <v-tab value="/admin">
        <div class="custom-tab">
          <v-icon size="24" icon="mdi-home-outline" />
          <p>Menu</p>
        </div>
      </v-tab>
      <v-tab value="/admin/agendamento">
        <div class="custom-tab">
          <v-icon icon="mdi-calendar-outline" size="24" />
          <p>Agendamentos</p>
        </div>
      </v-tab>
      <v-tab value="/admin/notificacao">
        <div class="custom-tab">
          <v-icon icon="mdi-bell-outline" size="24" />
          <p>Notificações</p>
        </div>
      </v-tab>
      <v-tab value="/admin/usuario">
        <div class="custom-tab">
          <v-icon icon="mdi-account-outline" size="24" />
          <p>Usuários</p>
        </div>
      </v-tab>
    </v-tabs>
    <v-tabs v-else v-model="currentTab" @click="changePage">
      <v-tab value="/">
        <div class="custom-tab">
          <v-icon size="24" icon="mdi-home-outline" />
          <p>Início</p>
        </div>
      </v-tab>
      <v-tab value="/contatos">
        <div class="custom-tab">
          <v-icon icon="mdi-phone-outline" size="24" />
          <p>Contatos</p>
        </div>
      </v-tab>
      <v-tab value="/notificacoes" @click="totalNotifications = 0">
        <div class="custom-tab">
          <v-icon
            :icon="totalNotifications > 0 ? 'mdi-bell-ring-outline' : 'mdi-bell-outline'"
            size="24"
          />
          <span 
            v-if="totalNotifications > 9"
            class="number-indicator"
            >+9</span
          >
          <span
            v-if="totalNotifications > 0 && totalNotifications < 9"
            class="number-indicator"
          >
            {{ totalNotifications }}
          </span>
          <p>Notificações</p>
        </div>
      </v-tab>
      <v-tab value="/perfil">
        <div class="custom-tab">
          <v-icon icon="mdi-account-outline" size="24" />
          <p>Perfil</p>
        </div>
      </v-tab>
    </v-tabs>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const auth = useAuthStore();
const totalNotifications = ref(0);
totalNotifications.value = auth.notReadNotifications;

watch(
  () => auth.notReadNotifications,
  (value, _) => totalNotifications.value = value
);
const currentTab = ref('/');
const route = useRoute();
const router = useRouter();

currentTab.value = route.path;

function changePage() {
  router.push(currentTab.value ?? '/');
}
</script>

<style scoped>
.custom-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-transform: none;
  width: 10px;
}

.number-indicator {
  position: absolute;
  right: 11px;
  top: 6px;
  background-color: #a30052;
  padding: 2px 5px;
  border-radius: 20px;
  color: #fff;
  z-index: 2;
}

@media (max-width: 450px) {
  .custom-tab p {
    font-size: 12px;
  }

  .fix-header {
    left: 0;
  }
}
</style>
