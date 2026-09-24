export default interface Appointment {
  id_usuario: number;
  id_agendamento: number;
  titulo: string;
  descricao: string;
  medico: string;
  data: string;
  local: string;
  nome_paciente?: string;
  lembrete_enviado: boolean;
}
