<template>
  <v-container class="d-flex ga-2 flex-column pb-16">

    <!-- LOGIN -->
    <template v-if="!autenticado">
      <v-app-bar>
        <template #prepend>
          <v-app-bar-title class="font-weight-bold ml-2">Recepção</v-app-bar-title>
        </template>
      </v-app-bar>
      <div class="d-flex flex-column ga-2 pt-4 mx-auto w-100 mt-8" style="max-width: 400px;">
        <p class="font-weight-bold text-h6 mb-3 text-center">Acesso restrito</p>
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
        <v-btn class="w-100 mt-2" color="primary" :loading="entrando" @click="fazerLogin">
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

      <div class="mt-16 pt-2 w-100 mx-auto" style="max-width: 800px;">
        <v-tabs v-model="tab" grow color="primary">
          <v-tab value="novo">Novo Agendamento</v-tab>
          <v-tab value="calendario">Calendário</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="mt-4">
          <!-- NOVO AGENDAMENTO -->
          <v-tabs-window-item value="novo">
            <v-form class="pt-2 pb-4" @submit.prevent="salvarAgendamento">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-autocomplete
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
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.titulo"
                    prepend-inner-icon="mdi-text-short"
                    label="Título"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.data"
                    prepend-inner-icon="mdi-calendar-clock-outline"
                    label="Data e hora"
                    type="datetime-local"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.local"
                    prepend-inner-icon="mdi-map-marker-outline"
                    label="Local"
                  />
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    v-model="form.medico"
                    prepend-inner-icon="mdi-stethoscope"
                    label="Médico responsável"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    v-model="form.descricao"
                    prepend-inner-icon="mdi-text"
                    label="Descrição"
                    variant="outlined"
                    rounded="lg"
                    rows="2"
                    auto-grow
                    @keydown.enter.exact.prevent="salvarAgendamento"
                  />
                </v-col>
              </v-row>

              <v-btn
                class="w-100 mt-2"
                color="primary"
                :loading="salvando"
                type="submit"
              >
                Confirmar agendamento
              </v-btn>
            </v-form>
          </v-tabs-window-item>

          <!-- CALENDÁRIO -->
          <v-tabs-window-item value="calendario">
            <section class="calendar pt-4">
              <ClientOnly>
                <NewCalendar
                  locale="pt-BR"
                  expanded
                  borderless
                  transparent
                  :attributes="attributes"
                  @dayclick="onDayClick"
                >
                  <template #day-popover="{ attributes: dayAttributes, dayTitle }">
                    <div class="px-2 py-1">
                      <div class="font-weight-bold mb-1 text-center">{{ dayTitle }}</div>
                      <template v-for="attr in dayAttributes.filter((a: any) => a.popover?.label).slice(0, 3)" :key="attr.key">
                        <div class="d-flex align-center text-caption mb-1">
                          <span class="rounded-circle mr-2" style="width: 8px; height: 8px; background-color: #E32585;" />
                          <span>{{ attr.popover.label }}</span>
                        </div>
                      </template>
                      <div v-if="dayAttributes.filter((a: any) => a.popover?.label).length > 3" class="text-caption font-italic mt-1">
                        + {{ dayAttributes.filter((a: any) => a.popover?.label).length - 3 }} agendamento(s)
                      </div>
                    </div>
                  </template>
                </NewCalendar>
              </ClientOnly>
            </section>
            
            <section v-if="dayExams.length > 0" class="scroll mt-4">
              <p class="mb-4">Compromissos marcados nesse dia</p>
              <exam-card-generator :exams="dayExams" @request-details="(exam: Exam) => requestDetails(exam)"/>
            </section>
            <section v-else class="text-center mt-8">
              Nenhum compromisso nesse dia
            </section>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>

      <div v-if="showExamDetails">
        <exam-card
          :id_agendamento="selectedExam.id_agendamento"
          :titulo="selectedExam.titulo"
          :descricao="selectedExam.descricao"
          :medico="selectedExam.medico"
          :data="selectedExam.data"
          :local="selectedExam.local"
          :id_paciente="selectedExam.id_paciente"
          :nome_paciente="selectedExam.nome_paciente"
          :lembrete_enviado="selectedExam.lembrete_enviado"
          :show="showExamDetails"
          :modo_google="false"
          @close="showExamDetails = !showExamDetails"
        />
      </div>
    </template>

  </v-container>
</template>

<script lang="ts">
import createAppointment from '~/utils/api/appointments/createAppointment';
import getAllAppointments from '~/utils/api/appointments/getAllAppointments';
import searchPatients from '~/utils/api/users/searchPatients';
import type Exam from '~/interfaces/exam';
import convertToISODate from '~/utils/others/convertToISODate';
import type CalendarAttributes from '~/interfaces/calendarAttributes';
import type CalendarDay from '~/interfaces/calendarDay';

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
      pacientesEncontrados: [] as any[],
      buscandoPacientes: false,
      pesquisaPaciente: '',
      timeoutBusca: null as any,
      form: {
        paciente: null as any,
        titulo: '',
        descricao: '',
        data: '',
        local: '',
        medico: '',
      },
      tab: 'novo',
      allExams: [] as Exam[],
      dayExams: [] as Exam[],
      attributes: [{
        key: 'today',
        highlight: {
          color: 'blue',
          fillMode: 'light',
        },
        dates: new Date(),
      }] as CalendarAttributes[],
      selectedDate: new Date(),
      showExamDetails: false,
      selectedExam: {} as Exam,
    };
  },
  watch: {
    pesquisaPaciente(val: string) {
      if (this.timeoutBusca) clearTimeout(this.timeoutBusca);

      if (!val || val.length < 2) {
        this.pacientesEncontrados = [];
        this.buscandoPacientes = false;
        return;
      }
      
      this.buscandoPacientes = true;
      
      this.timeoutBusca = setTimeout(async () => {
        const result = await searchPatients(val);
        this.pacientesEncontrados = result || [];
        this.buscandoPacientes = false;
      }, 500);
    }
  },
  mounted() {
    const token = useCookie('token_recepcao');
    if (token.value) {
      this.autenticado = true;
      this.fetchExams();
    }
  },
  methods: {
    async fetchExams() {
      this.allExams = await getAllAppointments() ?? [];
      
      const newAttributes: CalendarAttributes[] = [{
        key: 'today',
        highlight: {
          color: 'blue',
          fillMode: 'light',
        },
        dates: new Date(),
      }];

      this.allExams.forEach((exam) => 
        newAttributes.push({
          key: String(exam.id_agendamento),
          bar: {
            style: {
              backgroundColor: '#E32585'
            }
          },
          popover: {
            label: `${exam.nome_paciente || 'Paciente'} - ${exam.titulo}`
          },
          dates: convertToISODate(exam.data),
        })
      );

      this.attributes = newAttributes;
      this.updateExamsByDay();
    },
    updateExamsByDay() {
      this.dayExams = this.allExams.filter((exam) => this.compareDate(
        convertToISODate(exam.data), this.selectedDate
      ));
    },
    compareDate(firstDate: Date, secondDate: Date): boolean {
      return (firstDate.getDate() == secondDate.getDate())
      && (firstDate.getMonth() == secondDate.getMonth()) &&
      (firstDate.getFullYear() == secondDate.getFullYear());
    },
    onDayClick(selectedDay: CalendarDay) {
      this.selectedDate = selectedDay.date;
      this.updateExamsByDay();
    },
    requestDetails(exam: Exam) {
      this.showExamDetails = !this.showExamDetails;
      this.selectedExam = exam;
    },
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
          this.fetchExams();
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
      this.allExams = [];
      this.dayExams = [];
    },
    async salvarAgendamento() {
      if (!this.form.paciente || !this.form.titulo || !this.form.data) {
        this.toast.error('Preencha o paciente, título e data.');
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
          id_usuario: Number(this.form.paciente.id_usuario),
        });

        if (res.status === 200) {
          this.toast.success('Agendamento criado com sucesso!');
          this.form = { paciente: null, titulo: '', descricao: '', data: '', local: '', medico: '' };
          this.fetchExams(); // Atualiza a lista de agendamentos após salvar
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

<style scoped>
.scroll {
  overflow-y: auto;
  max-height: 400px;
}
.calendar {
  background-color: #ECEDF4;
  border-radius: 30px;
}
</style>