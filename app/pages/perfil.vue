<template>
  <v-container class="h-100 position-fixed">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-title
          class="font-weight-bold ml-2">
          Perfil
        </v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main class="text-center d-flex h-100 justify-space-between flex-column">
      <section class="d-flex flex-column ga-4">
        <client-only>
          <profile-image :id="user.id_usuario || -1" :main-image="profileImageURL" :size="100" />
          <h3 style="color: #4b4b4b">{{ user.nome }}</h3>
        </client-only>
        <v-btn
          class="w-100"
          color="#F8F8F8"
          text="Atualizar dados"
          prepend-icon="mdi-pencil-outline"
          to="/editar-perfil"
        />
        <v-btn
          class="w-100"
          color="#F8F8F8"
          text="Preferências de notificações"
          prepend-icon="mdi-bell-outline"
          to="/configurar-notificacoes"
        />
        <v-btn
          class="w-100"
          color="#F8F8F8"
          text="Desconectar"
          prepend-icon="mdi-exit-to-app"
          to="/login"
          @click="logUserOut"
        />
      </section>
      <p class="text-primary mb-14 cursor-pointer" @click="requestDelete">
        Excluir Conta
      </p>
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

<script lang="ts" setup>
import { useAuthStore } from "~/app/store/auth";
import { storeToRefs } from "pinia";
const config = useRuntimeConfig();
const showDelete = ref(false);

definePageMeta({ middleware: "auth", showHeader: true });
const auth = useAuthStore();
const { user } = storeToRefs(auth);
const profileImageURL: Ref<string | string> = ref('');

profileImageURL.value = user.value.foto_perfil ? 
`${config.public.apiBase}${user.value.foto_perfil}` : 'no-image';

function logUserOut(): void {
  auth.logUserOut();
}

function requestDelete(): void {
  showDelete.value = !showDelete.value;
}
</script>

<style scoped>
.v-btn {
  justify-content: flex-start;
  text-align: left;
}

.image-container {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
