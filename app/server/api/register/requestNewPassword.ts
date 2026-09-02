export default async function requestNewPassword(email: string) {
  const config = useRuntimeConfig();

  return await $fetch(
    `${config.apiBase}/usuarios/email/redefinir-senha`,
    {
      method: "POST",
      body: { email },
    },
  );
}