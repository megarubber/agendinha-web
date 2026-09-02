import type UserRegister from "#shared/types/userRegister";

export default async function createUser(user: UserRegister) {
  const config = useRuntimeConfig();

  return await $fetch(`${config.apiBase}/usuarios/registrar`, {
    method: "POST",
    body: user,
  });
}