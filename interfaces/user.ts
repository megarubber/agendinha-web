import { Role } from "~/interfaces/role";

export default interface User {
  id_usuario: number;
  nome: string;
  email: string;
  cadastro_confirmado: boolean;
  role: Role;
  foto_perfil: string | null;
  ativar_notificacoes_consultas: boolean;
  ativar_notificacoes_agendinha: boolean;
}
