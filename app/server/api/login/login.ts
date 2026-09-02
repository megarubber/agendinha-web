import type UserAuth from "#shared/types/userAuth";

export default async function login(user: UserAuth) {
  const config = useRuntimeConfig();

  return await $fetch(`${config.apiBase}/usuarios/login`, {
    method: "POST",
    body: user,
  });
}