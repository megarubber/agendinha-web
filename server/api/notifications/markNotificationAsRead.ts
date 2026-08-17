export default async function markNotificationAsRead(id_notificacao: number) {
  const { $api } = useNuxtApp();
  const token = useCookie("token");

  const response = await $api(`/notificacoes/${id_notificacao}/lida`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: { }
  });
  return response;
} 