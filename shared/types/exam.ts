export default interface Exam {
  id_agendamento: number;
  titulo: string;
  descricao: string;
  medico: string;
  data: string;
  local: string;
  id_paciente: number;
  nome_paciente?: string;
  lembrete_enviado: boolean;
}
