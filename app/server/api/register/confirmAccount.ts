import isNumber from "../../utils/isNumber";

export default async function confirmAccount(data: string) {
  let body: { id_usuario?: number; email?: string };

  if (isNumber(data)) {
    body = { id_usuario: Number(data) };
  } else {
    body = { email: data };
  }

  const config = useRuntimeConfig();

  const response = await $fetch(`${config.apiBase}/usuarios/confirmar`, {
    method: "POST",
    body,
  });

  return response;
}