<template>
  <v-container class="pa-0 h-100 position-fixed">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-title
          class="font-weight-bold ml-2">Contatos da APARTE</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main class="d-flex flex-column ga-2">
      <v-card
        v-for="contact in contacts"
        :key="contact.title"
        variant="flat"
        color="white"
      >
        <v-card-item class="mb-4">
          <template #prepend>
            <Icon size="20" :name="'icons:' + contact.icon" />
          </template>
          <v-card-title>{{ contact.title }}</v-card-title>
        </v-card-item>
        <v-card-text
          v-for="info in contact.info"
          :key="info"
          class="text-grey"
          style="line-height: 0.1rem"
        >
          {{ info }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="w-30 text-body-1 font-weight-bold"
            prepend-icon="mdi-content-copy"
            text="Copiar"
            @click="contact.callbackClipboard"
          />
          <v-btn
            class="w-30 text-body-1 px-4 font-weight-bold"
            color="#BCD4FF"
            variant="flat"
            style="color: #0C3784"
            prepend-icon="mdi-open-in-new"
            @click="contact.callbackAction"
            >{{ contact.action }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-main>
  </v-container>
</template>

<script setup lang="ts">
import changePage from '~/utils/changePage';
import openMap from '~/utils/openMap';
import copyToClipboard from '~/utils/copyToClipboard';

definePageMeta({ 
  middleware: "auth", 
  showHeader: true,
  requiresRole: "ROLE_USER"
});

function copy(data: string) {
  try {
    copyToClipboard(data);
    $toast.success("Copiado com sucesso!");        
  } catch(error) {
    $toast.error("Houve um erro ao copiar.");
    console.error(error);
  }
}

const { $toast } = useNuxtApp();
const contacts = [
  {
    icon: "phone",
    title: "Telefone",
    info: ["(12) 98245-4711"],
    action: "Ligar",
    callbackAction: () => changePage('tel:+1298245-4711'),
    callbackClipboard: () => copy("(12) 98245-4711")
  },
  {
    icon: "email",
    title: "E-mail",
    info: ["aparte@gmail.com.br"],
    action: "Enviar e-mail",
    callbackAction: () => changePage('mailto:aparte@gmail.com.br'),
    callbackClipboard: () => copy("aparte@gmail.com.br")
  },
  {
    icon: "map-marker",
    title: "Endereço",
    info: [
      "Av. Santa Cruz do Areão, 2495",
      "Res. Santa Izabel, Taubaté - SP",
      "CEP: 12061-100",
      
    ],
    action: "Abrir no mapa",
    callbackAction: () => openMap(-22.9924362, -45.5746279),
    callbackClipboard: () => copy("Av. Santa Cruz do Areão, 2495, Res. Santa Izabel, Taubaté - SP, CEP: 12061-100")
  },
];
</script>

<style scoped>
.v-btn--size-x-large {
  --v-btn-height: 35px;
}
</style>
