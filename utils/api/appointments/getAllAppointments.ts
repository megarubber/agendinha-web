export default async function getAllAppointments() {
  const { $api } = useNuxtApp();
  const token = useCookie('token_recepcao');
  
  if (!token.value) {
    return [];
  }

  try {
    const response = await $api('/agendamentos', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (response.status === 200) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar todos os agendamentos:', error);
    return [];
  }
}
