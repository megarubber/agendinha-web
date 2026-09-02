import type UserNewPasswordWithoutLogin from "#shared/types/userNewPasswordWithoutLogin";

export default async function setNewPasswordWithoutLogin(
  user: UserNewPasswordWithoutLogin
) {
  const config = useRuntimeConfig();

  return await $fetch(
    `${config.apiBase}/usuarios/redefinir-senha-sl`,
    {
      method: "PUT",
      body: user,
    }
  );
}