export default interface Exam {
  id_agendamento: number;
  titulo: string;
  descricao: string;
  medico: string;
  data: string;
  local: string;
  lembrete_enviado: boolean;
  show: boolean;
  modo_google: boolean;
}
