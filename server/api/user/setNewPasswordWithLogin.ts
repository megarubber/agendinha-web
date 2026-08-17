import type UserNewPasswordWithLogin from "~/interfaces/userNewPasswordWithLogin";

export default async function setNewPasswordWithLogin(password: UserNewPasswordWithLogin) {
  const { $api } = useNuxtApp();
  const token = useCookie("token");

  const response = await $api("/usuarios/redefinir-senha", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: password,
  });
  return response;
}