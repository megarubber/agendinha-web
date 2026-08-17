import type UserRegister from "~/interfaces/userRegister";

export default async function createUser(user: UserRegister) {
  const { $api } = useNuxtApp();

  const response = await $api("/usuarios/registrar", {
    method: "POST",
    body: user,
  });
  return response;
}
