export default interface AdminAgendamento {
  id_agendamento: number;
  titulo: string;
  descricao: string;
  medico: string;
  data: string;
  local: string;
  id_usuario: number;
  lembrete_enviado: boolean;
}