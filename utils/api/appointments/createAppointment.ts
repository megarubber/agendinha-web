export default async function createAppointment(data: {
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  medico: string;
  id_usuario: number;
}) {
  const { $api } = useNuxtApp();
  const token = useCookie('token_recepcao');
  const response = await $api('/agendamentos/create', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.value}` },
    body: data,
  });
  return response;
}