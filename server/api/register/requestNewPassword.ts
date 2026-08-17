export default async function requestNewPassword(email: string) {
  const { $api } = useNuxtApp();

  const response = await $api("/usuarios/email/redefinir-senha", {
    method: "POST",
    body: { email },
  });
  return response;
}