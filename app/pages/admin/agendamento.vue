<template>
  <v-container fluid class="h-100 position-fixed">
    <v-app-bar>
      <template #prepend>
        <v-app-bar-title
          class="font-weight-bold ml-2">Gerenciar agendamentos</v-app-bar-title>
      </template>
    </v-app-bar>
    <div class="mt-16 pt-2 w-100 mx-auto px-4">
      <v-tabs v-model="tab" grow color="primary">
        <v-tab value="novo">Novo Agendamento</v-tab>
        <v-tab value="calendario">Calendário</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab" class="mt-4">
        <!-- NOVO AGENDAMENTO -->
        <v-tabs-window-item value="novo">
          <v-form ref="formRef" class="pt-2 pb-4" @submit.prevent="salvarAgendamento">
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
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.titulo"
                  prepend-inner-icon="mdi-text-short"
                  label="Título"
                  :rules="[v => !!v || 'O título é obrigatório']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.data"
                  prepend-inner-icon="mdi-calendar-clock-outline"
                  label="Data e hora"
                  type="datetime-local"
                  :rules="[v => !!v || 'A data e hora são obrigatórias']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.local"
                  prepend-inner-icon="mdi-map-marker-outline"
                  label="Local"
                  :rules="[v => !!v || 'O local é obrigatório']"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.medico"
                  prepend-inner-icon="mdi-stethoscope"
                  label="Responsável pelo atendimento"
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
              {{ editingAppointmentId ? 'Salvar edição' : 'Confirmar agendamento' }}
            </v-btn>
          </v-form>
        </v-tabs-window-item>
        <!-- CALENDÁRIO -->
        <v-tabs-window-item value="calendario">
          <div class="mx-auto" style="max-width: 1000px;">
            <section class="calendar pt-4">
              <ClientOnly>
                <component 
                  :is="'NewCalendar'"
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
                      <template v-for="(popoverAttrs, i) in [dayAttributes.filter((a: any) => a.popover?.label)]" :key="i">
                        <template v-for="attr in popoverAttrs.slice(0, 3)" :key="attr.key">
                          <div class="d-flex align-center text-caption mb-1">
                            <span class="rounded-circle mr-2" style="width: 8px; height: 8px; background-color: #E32585;" />
                            <span>{{ attr.popover.label }}</span>
                          </div>
                        </template>
                        <div v-if="popoverAttrs.length > 3" class="text-caption font-italic mt-1">
                          + {{ popoverAttrs.length - 3 }} agendamento(s)
                        </div>
                      </template>
                    </div>
                  </template>
                </component>
              </ClientOnly>
            </section>
            <div v-if="dayExams.length > 0" class="mt-4">
              <p class="mb-4 font-weight-bold">Compromissos marcados nesse dia</p>
              <section class="scroll">
                <AppointmentCardGenerator :appointments="dayExams" @request-details="(exam: Appointment) => requestDetails(exam)"/>
              </section>
            </div>
            <section v-else class="text-center mt-8">
              Nenhum compromisso nesse dia
            </section>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
    <div v-if="showExamDetails && selectedExam">
      <AppointmentCard
        :id_agendamento="selectedExam.id_agendamento"
        :titulo="selectedExam.titulo"
        :descricao="selectedExam.descricao"
        :medico="selectedExam.medico"
        :data="selectedExam.data"
        :local="selectedExam.local"
        :id_paciente="(selectedExam as any).id_paciente"
        :nome_paciente="selectedExam.nome_paciente"
        :lembrete_enviado="selectedExam.lembrete_enviado"
        :show="showExamDetails"
        :modo_google="false"
        :modo_admin="true"
        @close="showExamDetails = false"
        @delete="openDeleteDialog"
        @edit="handleEditAppointment"
      />
    </div>
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="text-h6 font-weight-bold d-flex align-center text-error">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Apagar Agendamento
        </v-card-title>
        <v-card-text class="pt-2 text-body-1">
          Tem certeza que deseja apagar este agendamento? Esta ação <strong>não</strong> pode ser desfeita.
        </v-card-text>
        <v-card-actions class="d-flex ga-2 mt-2 px-4 pb-4">
          <v-btn 
            variant="tonal" 
            class="flex-grow-1 rounded-lg font-weight-bold" 
            height="44"
            @click="showDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="error" 
            variant="flat" 
            class="flex-grow-1 rounded-lg font-weight-bold" 
            height="44"
            @click="confirmDeleteAppointment"
          >
            Apagar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import type Appointment from '~~/shared/types/appointment';
import type CalendarAttributes from '~~/shared/types/calendarAttributes';
import { parseDateFromAPI, compareDateOnly, formatDateToAPI, formatDatetimeLocal } from '~/utils/date';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ showHeader: true, requiresRole: 'ROLE_ADMIN' });

const { $api, $toast } = useNuxtApp();
const toast = $toast as any;
const auth = useAuthStore();
const tokenCookie = useCookie<string | null>('token');
const router = useRouter();

// States
const formRef = ref<any>(null);
const editingAppointmentId = ref<number | null>(null);

const salvando = ref(false);
const pacientesEncontrados = ref<any[]>([]);
const buscandoPacientes = ref(false);
const pesquisaPaciente = ref('');
let timeoutBusca: any = null;

const form = ref({
  paciente: null as any,
  titulo: '',
  descricao: '',
  data: '',
  local: '',
  medico: '',
});

const tab = ref('novo');
const allExams = ref<(Appointment & { parsedDate?: Date })[]>([]);
const dayExams = ref<Appointment[]>([]);
const attributes = ref<CalendarAttributes[]>([{
  key: 'today',
  highlight: {
    color: 'blue',
    fillMode: 'light',
  },
  dates: new Date(),
}]);
const selectedDate = ref(new Date());
const showExamDetails = ref(false);
const selectedExam = ref<Appointment | null>(null);

const showDeleteDialog = ref(false);
const appointmentToDelete = ref<number | null>(null);

// Methods
const fetchExams = async () => {
  let data = [];
  try {
    const res: any = await $api('/agendamentos', {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenCookie.value}` }
    });
    if (res.status === 200 && res.data) {
      data = res.data;
    }
  } catch (e) {
    console.error(e);
  }
  
  allExams.value = data.map((exam: Appointment) => ({
    ...exam,
    parsedDate: parseDateFromAPI(exam.data)
  }));
  
  const newAttributes: CalendarAttributes[] = [{
    key: 'today',
    highlight: {
      color: 'blue',
      fillMode: 'light',
    },
    dates: new Date(),
  }];

  allExams.value.forEach((exam) => 
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
      dates: exam.parsedDate!,
    })
  );

  attributes.value = newAttributes;
  updateExamsByDay();
};

const updateExamsByDay = () => {
  // Usa a data pré-processada, melhorando a performance ao clicar nos dias
  dayExams.value = allExams.value.filter((exam) => 
    exam.parsedDate && compareDateOnly(exam.parsedDate, selectedDate.value)
  );
};

const onDayClick = (selectedDay: any) => {
  if (selectedDay instanceof Date) {
    selectedDate.value = selectedDay;
  } else if (selectedDay && selectedDay.date) {
    selectedDate.value = new Date(selectedDay.date);
  } else if (typeof selectedDay === 'string') {
    selectedDate.value = new Date(selectedDay);
  }
  updateExamsByDay();
};

const requestDetails = async (exam: Appointment) => {
  showExamDetails.value = false;
  await nextTick();
  selectedExam.value = exam;
  showExamDetails.value = true;
};

const openDeleteDialog = (id: number) => {
  appointmentToDelete.value = id;
  showDeleteDialog.value = true;
};

const confirmDeleteAppointment = async () => {
  if (!appointmentToDelete.value) return;
  const id = appointmentToDelete.value;
  
  try {
    const res: any = await $api(`/agendamentos/${id}/delete`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenCookie.value}` }
    });
    if (res.status === 200 || res.status === 204) {
      toast.success("Agendamento apagado com sucesso.");
      showExamDetails.value = false;
      fetchExams();
    } else {
      toast.error("Erro ao apagar agendamento.");
    }
  } catch {
    toast.error("Erro ao apagar agendamento.");
  } finally {
    showDeleteDialog.value = false;
    appointmentToDelete.value = null;
  }
};

const handleEditAppointment = (id: number) => {
  const examToEdit = allExams.value.find(e => e.id_agendamento === id);
  if (!examToEdit) return;

  // Format date for datetime-local input (YYYY-MM-DDThh:mm)
  let formattedDate = '';
  if (examToEdit.parsedDate) {
    formattedDate = formatDatetimeLocal(examToEdit.parsedDate);
  }

  form.value = {
    paciente: { id_usuario: (examToEdit as any).id_paciente, nome: examToEdit.nome_paciente },
    titulo: examToEdit.titulo,
    descricao: examToEdit.descricao,
    local: examToEdit.local,
    medico: examToEdit.medico,
    data: formattedDate,
  };
  
  pesquisaPaciente.value = examToEdit.nome_paciente || '';
  editingAppointmentId.value = id;
  showExamDetails.value = false;
  tab.value = 'novo';
};

const sair = () => {
  auth.logout();
  router.push('/login');
};

const salvarAgendamento = async () => {
  if (!formRef.value) return;
  const { valid } = await formRef.value.validate();
  
  if (!valid) {
    return;
  }

  salvando.value = true;
  try {
    const payload = {
      titulo: form.value.titulo.toUpperCase(),
      descricao: form.value.descricao.toUpperCase(),
      data: formatDateToAPI(form.value.data),
      local: form.value.local.toUpperCase(),
      medico: form.value.medico.toUpperCase(),
      id_usuario: Number(form.value.paciente.id_usuario),
    };

    let res: any;
    if (editingAppointmentId.value) {
      res = await $api(`/agendamentos/${editingAppointmentId.value}/update`, {
        method: 'PUT',
        body: payload,
        headers: { Authorization: `Bearer ${tokenCookie.value}` }
      });
    } else {
      res = await $api('/agendamentos/create', {
        method: 'POST',
        body: payload,
        headers: { Authorization: `Bearer ${tokenCookie.value}` }
      });
    }

    if (res.status === 200 || res.status === 201) {
      toast.success(editingAppointmentId.value ? 'Agendamento atualizado!' : `Agendamento criado com sucesso!`);
      form.value = { paciente: null, titulo: '', descricao: '', data: '', local: '', medico: '' };
      nextTick(() => {
        formRef.value?.resetValidation();
      });
      editingAppointmentId.value = null; // Clear edit mode
      fetchExams(); // Atualiza a lista de agendamentos após salvar
    } else {
      toast.error('Erro ao salvar agendamento.');
    }
  } catch {
    toast.error('Erro ao salvar agendamento.');
  } finally {
    salvando.value = false;
  }
};

// Watchers
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
      const res: any = await $api('/usuarios/pesquisar', {
        method: 'GET',
        query: { nome: val },
        headers: { Authorization: `Bearer ${tokenCookie.value}` }
      });
      pacientesEncontrados.value = res.data || [];
    } catch {
      pacientesEncontrados.value = [];
    }
    buscandoPacientes.value = false;
  }, 500);
});

// Lifecycle
onMounted(() => {
  fetchExams();
});
</script>

<style scoped>
.logo {
  max-width: 80px;
  margin-left: 40px;
}

.scroll {
  overflow-y: auto;
  max-height: 400px;
}
.calendar {
  background-color: #ECEDF4;
  border-radius: 30px;
}
</style>