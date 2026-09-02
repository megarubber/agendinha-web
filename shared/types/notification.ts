export default interface Notification {
  id_notificacao: number;
  titulo: string;
  descricao: string;
  data: string;
  lida: boolean;
  id_agendamento: number;
}
