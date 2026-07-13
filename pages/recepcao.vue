<template>
  <v-container class="d-flex ga-2 flex-column pb-16">

    <!-- LOGIN -->
    <template v-if="!autenticado">
      <v-app-bar>
        <template #prepend>
          <v-app-bar-title class="font-weight-bold ml-2">Recepção</v-app-bar-title>
        </template>
      </v-app-bar>
      <div class="d-flex flex-column ga-2 pt-4">
        <p class="font-weight-bold text-h6 mb-3">Acesso restrito</p>
        <v-text-field
          v-model="login.email"
          prepend-inner-icon="mdi-email-outline"
          label="E-mail"
        />
        <v-text-field
          v-model="login.senha"
          prepend-inner-icon="mdi-form-textbox-password"
          label="Senha"
          :type="showSenha ? 'text' : 'password'"
          :append-inner-icon="showSenha ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showSenha = !showSenha"
          @keyup.enter="fazerLogin"
        />
        <v-btn class="w-100" :loading="entrando" @click="fazerLogin">
          Entrar
        </v-btn>
      </div>
    </template>

    <!-- RECEPÇÃO -->
    <template v-else>
      <v-app-bar>
        <template #prepend>
          <v-app-bar-title class="font-weight-bold ml-2">Recepção</v-app-bar-title>
        </template>
        <template #append>
          <v-btn variant="text" icon="mdi-logout" @click="sair" />
        </template>
      </v-app-bar>

      <div class="d-flex flex-column ga-2 pt-4">
        <p class="font-weight-bold text-h6 mb-1">Novo agendamento</p>

        <v-text-field
          v-model="form.id_usuario"
          prepend-inner-icon="mdi-identifier"
          label="ID do paciente"
          type="number"
        />
        <v-text-field
          v-model="form.titulo"
          prepend-inner-icon="mdi-text-short"
          label="Título"
        />
        <v-text-field
          v-model="form.descricao"
          prepend-inner-icon="mdi-text"
          label="Descrição"
        />
        <v-text-field
          v-model="form.data"
          prepend-inner-icon="mdi-calendar-clock-outline"
          label="Data e hora"
          type="datetime-local"
        />
        <v-text-field
          v-model="form.local"
          prepend-inner-icon="mdi-map-marker-outline"
          label="Local"
        />
        <v-text-field
          v-model="form.medico"
          prepend-inner-icon="mdi-stethoscope"
          label="Médico responsável"
        />
        <v-btn class="w-100" :loading="salvando" @click="salvarAgendamento">
          Confirmar agendamento
        </v-btn>
      </div>
    </template>

  </v-container>
</template>

<script lang="ts">
import createAppointment from '~/utils/api/appointments/createAppointment';

export default defineComponent({
  name: 'Recepcao',
  setup() {
    definePageMeta({ middleware: [] });
  },
  data() {
    return {
      toast: useNuxtApp().$toast as any,
      autenticado: false,
      entrando: false,
      showSenha: false,
      login: { email: '', senha: '' },
      salvando: false,
      form: {
        id_usuario: '',
        titulo: '',
        descricao: '',
        data: '',
        local: '',
        medico: '',
      },
    };
  },
  mounted() {
    const token = useCookie('token_recepcao');
    if (token.value) this.autenticado = true;
  },
  methods: {
    async fazerLogin() {
      if (!this.login.email || !this.login.senha) return;
      this.entrando = true;
      const { $api } = useNuxtApp();
      try {
        const res = await $api('/admin/login', {
          method: 'POST',
          body: this.login,
        });
        if (res.status === 200) {
          useCookie('token_recepcao').value = res.data.token;
          this.autenticado = true;
        } else {
          this.toast.error('E-mail ou senha incorretos.');
        }
      } catch {
        this.toast.error('Erro ao fazer login.');
      } finally {
        this.entrando = false;
      }
    },
    sair() {
      useCookie('token_recepcao').value = null;
      this.autenticado = false;
      this.login = { email: '', senha: '' };
    },
    async salvarAgendamento() {
      if (!this.form.id_usuario || !this.form.titulo || !this.form.data) {
        this.toast.error('Preencha ID do paciente, título e data.');
        return;
      }
      this.salvando = true;
      try {
        const dt = new Date(this.form.data);
        const dia = String(dt.getDate()).padStart(2, '0');
        const mes = String(dt.getMonth() + 1).padStart(2, '0');
        const ano = dt.getFullYear();
        const hora = String(dt.getHours()).padStart(2, '0');
        const min = String(dt.getMinutes()).padStart(2, '0');

        const res = await createAppointment({
          titulo: this.form.titulo.toUpperCase(),
          descricao: this.form.descricao.toUpperCase(),
          data: `${dia}/${mes}/${ano} ${hora}:${min}`,
          local: this.form.local.toUpperCase(),
          medico: this.form.medico.toUpperCase(),
          id_usuario: Number(this.form.id_usuario),
        });

        if (res.status === 200) {
          this.toast.success('Agendamento criado com sucesso!');
          this.form = { id_usuario: '', titulo: '', descricao: '', data: '', local: '', medico: '' };
        } else {
          this.toast.error('Erro ao criar agendamento.');
        }
      } catch {
        this.toast.error('Erro ao criar agendamento.');
      } finally {
        this.salvando = false;
      }
    },
  },
});
</script>