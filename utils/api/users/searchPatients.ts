export default async function searchPatients(nome: string) {
  const { $api } = useNuxtApp();
  const token = useCookie('token_recepcao');
  
  if (!token.value || !nome) {
    return [];
  }

  try {
    const response = await $api(`/usuarios/pesquisar?nome=${encodeURIComponent(nome)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (response.status === 200) {
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    return [];
  }
}
