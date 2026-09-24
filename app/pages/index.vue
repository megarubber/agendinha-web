<template>
  <v-container class="pa-0 h-100 position-fixed">
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      rounded="pill"
      bg-color="#ECEDF4"
      base-color="white"
      class="mt-6 mx-3"
      label="Buscar compromisso"
      @input="filterAppointmentListByTitle"
    />
    <div class="d-flex flex-column ga-2">
      <v-tabs v-model="tab">
        <v-tab class="w-50" color="black" value="appointment">
          <div class="tab-content d-flex align-center">
            <Icon 
              class="mr-2" 
              :style="tab === 'appointment' ? 'transform: rotate(-10deg); transition: transform 0.3s ease;' 
              : 'transform: none; transition: transform 0.3s ease;'"
              name="icons:bookmark-icons" 
              size="25" />
            <p class="font-weight-bold">Agendamentos</p>
          </div>
        </v-tab>
        <v-tab class="w-50" color="black" value="calendar">
          <div class="tab-content d-flex align-center">
            <Icon 
              class="mr-2"
              :style="tab === 'calendar' ? 'transform: rotate(-10deg); transition: transform 0.3s ease;' 
              : 'transform: none; transition: transform 0.3s ease;'"
              name="icons:calendar" size="25" />
            <p class="font-weight-bold">Calendário</p>
          </div>
        </v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab" class="px-3">
        <v-tabs-window-item value="appointment">
          <section v-if="noExams">
            <p class="text-center">Sem compromissos nas próximas semanas.</p>
          </section>
          <section v-else>
            <section v-if="weekExams.length > 0" class="scroll">
              <p class="mb-2">
                {{ statusMessage.begin }}
                <span class="text-blue-dark font-weight-bold">{{
                  statusMessage.middle
                }}</span>
                {{ statusMessage.end }} para esta semana.
              </p>
              <section class="scroll">
                <exam-card-generator :exams="weekExams" @request-details="(exam: Exam) => requestDetails(exam)" />
              </section>
            </section>
            <section v-if="futureExams.length > 0">
              <p class="mt-4 mb-4">Compromissos futuros</p>
              <section class="scroll">
                <exam-card-generator :exams="futureExams" @request-details="(exam: Exam) => requestDetails(exam)" />
              </section>
            </section>
          </section>
        </v-tabs-window-item>
        <v-tabs-window-item value="calendar">
          <section class="calendar">
            <client-only>
              <NewCalendar
                locale="pt-BR" 
                expanded
                borderless
                transparent
                :attributes='attributes'
                @dayclick="onDayClick"
              />
            </client-only>
          </section>
          <section v-if="dayExams.length > 0" class="scroll">
            <p class="mt-4 mb-4">Compromissos marcados nesse dia</p>
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
        :lembrete_enviado="selectedExam.lembrete_enviado"
        :show="showExamDetails"
        :modo_google="auth.googleTokens.access_token != undefined"
        @close="showExamDetails = !showExamDetails"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import type Exam from "~~/shared/types/appointment";
import convertToISODate from "~/utils/convertToISODate";
import moment from "moment";
import { useLoaderStore } from "~/stores/loader";
import type CalendarAttributes from "~~/shared/types/calendarAttributes";
import type CalendarDay from "~~/shared/types/calendarDay";
import { useAuthStore } from "~/stores/auth";

export default defineComponent({
  name: "Home",
  setup() {
    definePageMeta({ 
      middleware: "auth", 
      showHeader: true,
      requiresRole: "ROLE_USER"
    });
  },
  data() {
    return {
      loader: useLoaderStore(),
      weekExams: ref([] as Exam[]),
      futureExams: ref([] as Exam[]),
      dayExams: [] as Exam[],
      allExams: ref([] as Exam[]),
      searchedExams: ref([] as Exam[]),
      statusMessage: reactive({ 
        begin: "Existem",
        middle: "0 compromissos",
        end: "agendados",
      }),
      tab: ref(null),
      noExams: ref(false),
      attributes: ref<CalendarAttributes[]>([{
        key: "today",
        highlight: {
          color: 'blue',
          fillMode: 'light',
        },
        dates: new Date(),
      }]),
      search: ref(''),
      selectedDate: new Date(),
      showExamDetails: ref(false),
      selectedExam: ref({} as Exam),
      auth: useAuthStore(),
    }
  },
  async mounted() {
    this.loader.startLoading();
    const { $api } = useNuxtApp();
    const token = useCookie("token");

    const response = await $api("/agendamentos/usuario", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    
    this.allExams = response.data ?? [];

    if(this.allExams.length <= 0) {
      this.loader.endLoading();
      this.noExams = true;
      return;
    }

    this.allExams.forEach((exam) => 
      this.attributes.push({
        key: exam.titulo,
        bar: {
          style: {
            backgroundColor: '#E32585'
          }
        },
        dates: convertToISODate(exam.data),
      })
    );

    this.updateExamsList();
    this.updateText();

    this.loader.endLoading();
  },
  methods: {
    updateExamsList() {
      this.weekExams = this.allExams.filter((exam) => 
        this.isDateInThisWeek(convertToISODate(exam.data)) == 0
      );

      this.futureExams = this.allExams.filter(
        (exam) => this.isDateInThisWeek(convertToISODate(exam.data)) == 1,
      );

      if(this.weekExams.length <= 0 && this.futureExams.length <= 0)
        this.noExams = true;
    },
    updateExamsByDay() {
      let compare = (exam: Exam) => this.compareDate(
        convertToISODate(exam.data), this.selectedDate
      );

      if(this.search.length > 0)
        compare = (exam: Exam) => this.compareDate(
          convertToISODate(exam.data), this.selectedDate
        ) && exam.titulo.toLowerCase() == this.search.toLowerCase();
      
      this.dayExams = this.allExams.filter(compare);
    },
    updateText() {
      this.statusMessage.begin =
        this.weekExams.length == 1 ? "Existe" : "Existem";
      this.statusMessage.middle =
        this.weekExams.length == 1
          ? "1 compromisso"
          : `${this.weekExams.length} compromissos`;
      this.statusMessage.end =
        this.weekExams.length == 1 ? "agendado" : "agendados";
    },
    isDateInThisWeek(date: Date) {
      const now = moment();
      const currentDate = moment(date.toISOString());

      if(now.isoWeek() == currentDate.isoWeek())
        return 0;
      else if(now.isoWeek() < currentDate.isoWeek())
        return 1;

      return -1;
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
    filterAppointmentListByTitle() {
      this.updateExamsList();
      this.updateText();
      this.updateExamsByDay();

      if(this.search.length <= 0) {
        this.updateText();
        return;
      }

      this.weekExams = this.weekExams.filter(
        (exam) => exam.titulo.toLowerCase().includes(this.search.toLowerCase())
      );

      this.futureExams = this.futureExams.filter(
        (exam) => exam.titulo.toLowerCase().includes(this.search.toLowerCase())
      );

      this.dayExams = this.dayExams.filter(
        (exam) => exam.titulo.toLowerCase().includes(this.search.toLowerCase())
      );

      this.updateText();
    },
    requestDetails(exam: Exam) {
      this.showExamDetails = !this.showExamDetails;
      this.selectedExam = exam;
    }
  },
});
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
  height: 400px;
}

.calendar {
  background-color: #ECEDF4;
  border-radius: 30px;
}
</style>
