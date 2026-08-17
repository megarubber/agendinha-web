export default async function deleteNotification(id_notificacao: number) {
  const { $api } = useNuxtApp();
  const token = useCookie("token");

  const response = await $api(`/notificacoes/id/${id_notificacao}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  return response;
} 