export default interface ShowAppointment {
  id_agendamento: number;
  titulo: string;
  descricao: string;
  medico: string;
  data: string;
  local: string;
  nome_paciente?: string;
  lembrete_enviado: boolean;
  show: boolean;
  modo_google: boolean;
}
