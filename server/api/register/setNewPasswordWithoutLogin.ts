import type UserNewPasswordWithoutLogin from "~/interfaces/userNewPasswordWithoutLogin";

export default async function setNewPasswordWithoutLogin(user: UserNewPasswordWithoutLogin) {
  const { $api } = useNuxtApp();

  const response = await $api("/usuarios/redefinir-senha-sl", {
    method: "PUT",
    body: user,
  });
  return response;
}