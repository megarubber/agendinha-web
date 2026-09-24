import type Exam from "~~/shared/types/appointment";

export const useAppointments = () => {
  const config = useRuntimeConfig();
  const token = useCookie("token");

  const getExams = async (): Promise<Exam[]> => {
    const response = await $fetch<{ data: Exam[] }>(
      `${config.public.apiBase}/agendamentos/usuario`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      },
    );

    return response.data;
  };

  const createAppointment = async (data: {
    titulo: string;
    descricao: string;
    data: string;
    local: string;
    medico: string;
    id_usuario: number;
  }) => {
    return await $fetch(`${config.public.apiBase}/agendamentos/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: data,
    });
  };

  return {
    getExams,
    createAppointment,
  };
};