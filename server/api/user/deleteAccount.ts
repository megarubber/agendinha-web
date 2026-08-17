export default async function deleteAccount(id_usuario: number) {
  const { $api } = useNuxtApp();
  const token = useCookie("token");

  const response = await $api("/usuarios/delete", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: { id_usuario }
  });
  return response;
}