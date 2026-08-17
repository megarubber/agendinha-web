export default async function getUserInfo() {
  const { $api } = useNuxtApp();
  const token = useCookie("token");

  const response = await $api("/usuarios", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  return response;
}