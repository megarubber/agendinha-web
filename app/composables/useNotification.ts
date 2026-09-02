import type Notification from "#shared/types/notification";

export const useNotification = () => {
  const config = useRuntimeConfig();
  const token = useCookie("token");

  const getPatientNotifications = async (
    user_id: number,
  ): Promise<Notification[]> => {
    const response = await $fetch<{ data: Notification[] }>(
      `${config.public.apiBase}/notificacoes/usuario/${user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    );

    return response.data;
  };

  const markNotificationAsRead = async (id_notificacao: number) => {
    return await $fetch(
      `${config.public.apiBase}/notificacoes/${id_notificacao}/lida`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: {},
      },
    );
  };

  const deleteNotification = async (id_notificacao: number) => {
    return await $fetch(
      `${config.public.apiBase}/notificacoes/id/${id_notificacao}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    );
  };

  return {
    getPatientNotifications,
    markNotificationAsRead,
    deleteNotification,
  };
};