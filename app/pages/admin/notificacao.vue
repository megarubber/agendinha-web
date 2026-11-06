<template>
  <v-container fluid class="h-100 position-fixed">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-title class="font-weight-bold ml-2">
          Gerenciar notificações
        </v-app-bar-title>
      </template>
    </v-app-bar>
    <div class="mt-16 pt-2 w-100 mx-auto px-4">
      <v-form ref="formRef" class="pt-2 pb-4" @submit.prevent="salvarNotificacao">
        <v-row dense>
          <v-col cols="12">
            <v-switch
                v-model="form.broadcast"
                label="Enviar para todos os pacientes"
                class="ma-0 pa-0" 
                inset 
                density="compact"
                hide-details
                />
            </v-col>
          <v-col cols="12">
            <v-autocomplete
              v-if="!form.broadcast"
              v-model="form.paciente"
              v-model:search="pesquisaPaciente"
              :items="pacientesEncontrados"
              :loading="buscandoPacientes"
              item-title="nome"
              return-object
              prepend-inner-icon="mdi-account-search"
              label="Paciente"
              placeholder="Buscar por nome..."
              variant="outlined"
              rounded="lg"
              :hide-no-data="!pesquisaPaciente || pesquisaPaciente.length < 2"
              clearable
              :rules="[v => !!v || 'O paciente é obrigatório']"
            >
              <template #no-data>
                <v-list-item>
                  <v-list-item-title v-if="buscandoPacientes" class="d-flex align-center">
                    <v-progress-circular indeterminate size="20" width="2" color="primary" class="mr-2" />
                    Buscando pacientes...
                  </v-list-item-title>
                  <v-list-item-title v-else>
                    Nenhum paciente encontrado.
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template #item="{ props, item }">
                <v-list-item v-bind="props" :subtitle="item.raw.email" />
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="form.titulo"
              prepend-inner-icon="mdi-format-title"
              label="Título"
              :rules="[v => !!v?.trim() || 'O título é obrigatório']"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="form.descricao"
              prepend-inner-icon="mdi-text-box-outline"
              label="Descrição"
              variant="outlined"
              rounded="lg"
              rows="3"
              auto-grow
              :rules="[v => !!v?.trim() || 'A descrição é obrigatória']"
            />
          </v-col>
        </v-row>
        <v-btn
          class="w-100 mt-2"
          color="primary"
          :loading="salvando"
          type="submit"
        >
          Cadastrar notificação
        </v-btn>
      </v-form>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import type NotificationRegister from '~~/shared/types/notificationRegister';

definePageMeta({ showHeader: true, requiresRole: "ROLE_ADMIN" });

const { $api, $toast } = useNuxtApp();
const toast = $toast as any;
const tokenCookie = useCookie<string | null>("token");

const formRef = ref<any>(null);
const salvando = ref(false);

const pacientesEncontrados = ref<any[]>([]);
const buscandoPacientes = ref(false);
const pesquisaPaciente = ref("");
let timeoutBusca: any = null;

const form = ref({
  broadcast: false,
  paciente: null as any,
  titulo: "",
  descricao: "",
});

function resetForm() {
  form.value = {
    broadcast: false,
    paciente: null,
    titulo: "",
    descricao: "",
  };
  pesquisaPaciente.value = "";
  pacientesEncontrados.value = [];
  nextTick(() => formRef.value?.resetValidation());
}

const salvarNotificacao = async () => {
  if (!formRef.value) return;
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  salvando.value = true;
  try {
    const payload: NotificationRegister = {
      id_usuario: form.value.paciente ? Number(form.value.paciente.id_usuario) : 0,
      titulo: form.value.titulo,
      descricao: form.value.descricao,
    };

    if(form.value.broadcast) delete payload.id_usuario;

    const res: any = await $api("/notificacoes", {
      method: "POST",
      body: payload,
      headers: { Authorization: `Bearer ${tokenCookie.value}` },
    });

    if (res.status === 200 || res.status === 201) {
      toast.success("Notificação criada com sucesso.");
      resetForm();
    } else {
      toast.error("Erro ao criar a notificação.");
    }
  } catch(e) {
    console.error(e);
    toast.error("Erro ao criar a notificação.");
  } finally {
    salvando.value = false;
  }
};

// Busca de pacientes (com debounce)
watch(pesquisaPaciente, (val: string) => {
  if (timeoutBusca) clearTimeout(timeoutBusca);

  if (form.value.paciente && val === form.value.paciente.nome) {
    return;
  }

  if (!val || val.length < 2) {
    pacientesEncontrados.value = [];
    buscandoPacientes.value = false;
    return;
  }

  buscandoPacientes.value = true;

  timeoutBusca = setTimeout(async () => {
    try {
      const res: any = await $api("/usuarios/pesquisar", {
        method: "GET",
        query: { nome: val },
        headers: { Authorization: `Bearer ${tokenCookie.value}` },
      });
      pacientesEncontrados.value = res.data || [];
    } catch {
      pacientesEncontrados.value = [];
    }
    buscandoPacientes.value = false;
  }, 500);
});
</script>